import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

type Payment = {
  pay_id: string;
  paid_on: string;
  amount: number;
};

export const usePayments = (startDate: string, endDate: string) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [dailyPayments, setDailyPayments] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  return { payments, totalAmount, dailyPayments, loading };
};
