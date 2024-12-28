"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import Loader from "react-js-loader";
import dynamic from "next/dynamic";
import { GiExpense } from "react-icons/gi";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Expense {
  id: string;
  date: string;
  amount: number;
  tennant: {
    name: string;
  };
}

interface ExpenseCardProps {
  startDate: string;
  endDate: string;
}

const ExpenseCard = ({ startDate, endDate }: ExpenseCardProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [addedBy, setAddedBy] = useState<{ name: string; total: number }[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<number[]>([]);

  useEffect(() => {
    fetchExpenses();
  }, [startDate, endDate]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Expenses")
        .select(`*, tennant:uid (name)`)
        .gte("date", startDate)
        .lte("date", endDate);

      if (error) {
        console.error("Error fetching expenses:", error);
        setLoading(false);
        return;
      }

      setExpenses(data);
      calculateTotalAmount(data);
      calculateAddedBy(data);
      calculateDailyExpenses(data);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (data: Expense[]) => {
    const total = data.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalAmount(total);
  };

  const calculateAddedBy = (data: Expense[]) => {
    const addedByMap: { [key: string]: number } = {};
    data.forEach((expense) => {
      const name = expense.tennant?.name;
      if (name) {
        if (!addedByMap[name]) {
          addedByMap[name] = 0;
        }
        addedByMap[name] += expense.amount;
      }
    });
    const addedByArray = Object.keys(addedByMap).map((name) => ({
      name,
      total: addedByMap[name],
    }));
    setAddedBy(addedByArray);
  };

  const calculateDailyExpenses = (data: Expense[]) => {
    const dailyExpensesMap: { [key: string]: number } = {};
    data.forEach((expense) => {
      const date = format(new Date(expense.date), "yyyy-MM-dd");
      if (!dailyExpensesMap[date]) {
        dailyExpensesMap[date] = 0;
      }
      dailyExpensesMap[date] += expense.amount;
    });

    const dailyExpensesArray = [];
    for (
      let date = new Date(startDate);
      date <= new Date(endDate);
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = format(date, "yyyy-MM-dd");
      dailyExpensesArray.push(dailyExpensesMap[formattedDate] || 0);
    }
    setDailyExpenses(dailyExpensesArray);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-IN");
  };

  let chartSeries = [
    {
      name: "Daily Expenses",
      data: dailyExpenses,
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
    colors: ["#f55105"],
    xaxis: {
      type: "datetime",
      categories: Array.from({ length: dailyExpenses.length }, (_, i) =>
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
            <GiExpense className="text-orange-600 text-4xl mr-2" />
            <div>
              <div className="text-lg text-gray-700 font-semibold -mb-1">
                Expenses
              </div>
              <div className="text-sm text-gray-500">
                ({format(new Date(startDate), "dd-MMM-yyyy")} -
                {format(new Date(endDate), "dd-MMM-yyyy")})
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-3xl font-bold">₹{formatAmount(totalAmount)}</div>
            <div className="h-6 border-l border-gray-300 mx-4"></div>
            <div className="text-sm">
              <ul className="list-disc list-inside">
                {addedBy.map((user) => (
                  <div key={user.name}>
                    {user.name.charAt(0).toUpperCase() + user.name.slice(1)}: ₹
                    {formatAmount(user.total)}
                  </div>
                ))}
              </ul>
            </div>
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

export default ExpenseCard;
