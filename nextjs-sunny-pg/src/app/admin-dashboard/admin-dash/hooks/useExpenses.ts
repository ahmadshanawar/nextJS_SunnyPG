import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

type Expense = {
  id: string;
  date: string;
  amount: number;
  tennant: {
    name: string;
  };
};

export const useExpenses = (startDate: string, endDate: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [addedBy, setAddedBy] = useState<{ name: string; total: number }[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  return { expenses, totalAmount, addedBy, dailyExpenses, loading };
};
