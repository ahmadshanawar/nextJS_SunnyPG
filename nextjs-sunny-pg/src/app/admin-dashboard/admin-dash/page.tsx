"use client";
import { useState } from "react";
import { format, endOfMonth, startOfMonth } from "date-fns";
import TennantsCard from "./common/tennants-card";
import ExpenseCard from "./common/expense-card";
import PaymentsCard from "./common/payments-card";
import DateSelector from "@/app/components/DateSelector";
import { useTennantsAndVacancies } from "./hooks/useTennantsAndVacancies";
import { usePayments } from "./hooks/usePayments";
import { useExpenses } from "./hooks/useExpenses";

export default function AdminDash() {
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );

  const {
    activeTennants,
    vacancies,
    loading: tennantsLoading,
  } = useTennantsAndVacancies();
  const {
    payments,
    totalAmount,
    dailyPayments,
    loading: paymentsLoading,
  } = usePayments(startDate, endDate);
  const {
    expenses,
    totalAmount: totalExpenseAmount,
    addedBy,
    dailyExpenses,
    loading: expensesLoading,
  } = useExpenses(startDate, endDate);

  return (
    <>
      <div className="container mx-auto p-4 mt-8"></div>
      <div className="items-center mb-4 mx-2">
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
        <TennantsCard
          activeTennants={activeTennants}
          vacancies={vacancies}
          loading={tennantsLoading}
        />
        <PaymentsCard
          startDate={startDate}
          endDate={endDate}
          payments={payments}
          totalAmount={totalAmount}
          dailyPayments={dailyPayments}
          loading={paymentsLoading}
        />
        <ExpenseCard
          startDate={startDate}
          endDate={endDate}
          expenses={expenses}
          totalAmount={totalExpenseAmount}
          addedBy={addedBy}
          dailyExpenses={dailyExpenses}
          loading={expensesLoading}
        />
      </div>
    </>
  );
}
