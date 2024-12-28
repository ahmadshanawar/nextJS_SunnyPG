"use client";
import { useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import TennantsCard from "./common/tennants-card";
import ExpenseCard from "./common/expense-card";
import PaymentsCard from "./common/payments-card";

export default function AdminDash() {
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );

  return (
    <div className="container mx-auto p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <div>
            <label className="flex justify-end block text-sm font-medium text-gray-700">
              Start Date:(MM/DD/YYYY)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple-800"
            />
          </div>
          <div>
            <label className="flex justify-end block text-sm font-medium text-gray-700">
              End Date: (MM/DD/YYYY)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple-800"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TennantsCard />
        <PaymentsCard startDate={startDate} endDate={endDate} />
        <ExpenseCard startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
}
