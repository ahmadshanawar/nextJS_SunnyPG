"use client";
import { useState } from "react";
import { format, endOfMonth, startOfMonth } from "date-fns";
import TennantsCard from "./common/tennants-card";
import ExpenseCard from "./common/expense-card";
import PaymentsCard from "./common/payments-card";
import DateSelector from "@/app/components/DateSelector";

export default function AdminDash() {
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );

  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="items-center mb-4">
        <div className="flex space-x-4">
          <DateSelector
            value={new Date(startDate)}
            onChange={setStartDate}
            label="Start Date"
          />
          <DateSelector
            value={new Date(endDate)}
            onChange={setEndDate}
            label="End Date"
          />
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
