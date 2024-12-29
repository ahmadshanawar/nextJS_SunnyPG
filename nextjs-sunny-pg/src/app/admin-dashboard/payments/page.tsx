"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
} from "react-icons/fa";
import Loader from "react-js-loader";
import DateSelector from "@/app/components/DateSelector";

interface Payment {
  pay_id: string;
  amount: number;
  paid_on: string;
  billing_start_date: string;
  billing_end_date: string;
  tennant: {
    name: string;
    room_number: number;
  };
}

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Payments")
      .select(
        `*,tennant:uid (
          name,
          room_number
        )`
      )
      .eq("paid", true)
      .gte("paid_on", startDate)
      .lte("paid_on", endDate);

    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      setPayments(data);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchPayments();
  };

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortArray(key, direction);
  };

  const sortArray = (key: string, direction: string) => {
    const sortedData = [...payments].sort((a: any, b: any) => {
      const aValue = key.includes(".")
        ? key.split(".").reduce((o, i) => o[i], a)
        : a[key];
      const bValue = key.includes(".")
        ? key.split(".").reduce((o, i) => o[i], b)
        : b[key];
      if (aValue < bValue) {
        return direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setPayments(sortedData);
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="ml-1 text-lg" />;
    }
    if (sortConfig.direction === "ascending") {
      return <FaSortUp className="ml-1 text-lg" />;
    }
    return <FaSortDown className="ml-1 text-lg" />;
  };
  const calculateTotalAmount = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };
  return (
    <div className="container mx-auto p-4 w-screen">
      <div className="flex justify-end">
        <h1 className="text-2xl font-semibold mb-1">Payments</h1>
      </div>
      <hr className="mb-2" />

      <div className="md:flex md:items-center md:justify-end">
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex justify-end sm:hidden"
        >
          <button className="text-gray-700 px-1 py-1 rounded-md flex items-center border border-gray-200 bg-gray-100">
            <span className="ml-2">
              <FaFilter className="text-md" />
            </span>
            <div className="mt-2">
              {isMenuOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </div>
          </button>
        </div>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:flex sm:items-center sm:space-x-4`}
        >
          <div className="mr-2">
            <DateSelector
              value={new Date(startDate)}
              onChange={setStartDate}
              label="Start Date"
            />
          </div>
          <div className="mr-2">
            <DateSelector
              value={new Date(endDate)}
              onChange={setEndDate}
              label="End Date"
            />
          </div>
          <div className="mt-6">
            <button
              onClick={handleSearch}
              className="flex flex-row items-center bg-purple-800 hover:bg-purple-700 text-white px-2 py-2 rounded-md"
            >
              Search
              <FaSearch className="ml-2" />
            </button>
          </div>
        </div>
      </div>

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
        <div className="mt-1 overflow-x-auto max-h-[calc(100vh-200px)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("tennant.name")}
                >
                  <div className="flex items-center">
                    <span>Name</span>
                    {getSortIcon("tennant.name")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("tennant.room_number")}
                >
                  <div className="flex items-center">
                    <span>Room Number</span>
                    {getSortIcon("tennant.room_number")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    <span>Amount(₹)</span>
                    {getSortIcon("amount")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("paid_on")}
                >
                  <div className="flex items-center">
                    <span>Paid On</span>
                    {getSortIcon("paid_on")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("billing_start_date")}
                >
                  <div className="flex items-center">
                    <span>Billing Period</span>
                    {getSortIcon("billing_start_date")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments?.map((payment: Payment, index: number) => (
                <tr key={`${payment.pay_id}-${index}`}>
                  <td className="px-2 py-3 whitespace-nowrap text-sm">
                    {payment.tennant.name}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    {payment.tennant.room_number}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    {payment.amount}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    {format(parseISO(payment.paid_on), "dd-MMM-yyyy")}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm">
                    {`${format(
                      parseISO(payment.billing_start_date),
                      "dd-MMM-yyyy"
                    )} - ${format(
                      parseISO(payment.billing_end_date),
                      "dd-MMM-yyyy"
                    )}`}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={2}
                  className="px-2 py-2 text-right text-sm text-bold font-medium text-gray-900"
                >
                  Total:
                </td>
                <td className="px-2 py-2 text-sm font-medium text-bold text-gray-900">
                  {calculateTotalAmount()}
                </td>
                <td className="px-2 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
