"use client";
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
  expenses: Expense[];
  totalAmount: number;
  addedBy: { name: string; total: number }[];
  dailyExpenses: number[];
  loading: boolean;
}

const ExpenseCard = ({
  startDate,
  endDate,
  expenses,
  totalAmount,
  addedBy,
  dailyExpenses,
  loading,
}: ExpenseCardProps) => {
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
            <div className="text-2xl font-bold">₹{formatAmount(totalAmount)}</div>
            <div className="h-6 border-l border-gray-300 mx-3"></div>
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
