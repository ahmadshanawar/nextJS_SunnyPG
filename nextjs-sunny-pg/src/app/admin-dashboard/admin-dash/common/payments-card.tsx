"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import Loader from "react-js-loader";
import dynamic from "next/dynamic";
import { FaMoneyBillWave } from "react-icons/fa";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Payment {
  pay_id: string;
  paid_on: string;
  amount: number;
}

interface PaymentsCardProps {
  startDate: string;
  endDate: string;
}

const PaymentsCard = ({ startDate, endDate }: PaymentsCardProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [dailyPayments, setDailyPayments] = useState<number[]>([]);

  useEffect(() => {
    fetchPayments();
  }, [startDate, endDate]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Payments")
        .select("pay_id, paid_on, amount")
        .gte("paid_on", startDate)
        .lte("paid_on", endDate);

      if (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
        return;
      }

      setPayments(data);
      calculateTotalAmount(data);
      calculateDailyPayments(data);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (data: Payment[]) => {
    const total = data.reduce((sum, payment) => sum + payment.amount, 0);
    setTotalAmount(total);
  };

  const calculateDailyPayments = (data: Payment[]) => {
    const dailyPaymentsMap: { [key: string]: number } = {};
    data.forEach((payment) => {
      const date = format(new Date(payment.paid_on), "yyyy-MM-dd");
      if (!dailyPaymentsMap[date]) {
        dailyPaymentsMap[date] = 0;
      }
      dailyPaymentsMap[date] += payment.amount;
    });

    const dailyPaymentsArray = [];
    for (
      let date = new Date(startDate);
      date <= new Date(endDate);
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = format(date, "yyyy-MM-dd");
      dailyPaymentsArray.push(dailyPaymentsMap[formattedDate] || 0);
    }
    setDailyPayments(dailyPaymentsArray);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-IN");
  };

  let chartSeries = [
    {
      name: "Daily Payments",
      data: dailyPayments,
    },
  ];

  let chartOptions = {
    chart: {
      id: "sparkline",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    colors: ["#28a745"],
    xaxis: {
      type: "datetime",
      categories: Array.from({ length: dailyPayments.length }, (_, i) =>
        format(
          new Date(startDate).setDate(new Date(startDate).getDate() + i),
          "yyyy-MM-dd"
        )
      ),
    },
  };

  return (
    <div className="my-2 mt-10 bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader
            type="hourglass"
            bgColor={"#7c3ab3"}
            color={"#828282"}
            title={"Loading..."}
            size={60}
          />
        </div>
      ) : (
        <>
          <div className="flex flex-row items-center">
            <FaMoneyBillWave className="text-green-600 text-4xl mr-2" />
            <div>
              <div className="text-lg text-gray-700 font-semibold -mb-1">
                Revenue
              </div>
              <div className="text-sm text-gray-500">
                ({format(new Date(startDate), "dd-MMM-yyyy")} -
                {format(new Date(endDate), "dd-MMM-yyyy")})
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-3xl font-bold">₹{formatAmount(totalAmount)}</div>
          </div>

          <div className="mt-4">
            <ApexChart
              options={chartOptions as any}
              series={chartSeries}
              type="area"
              height={100}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsCard;
