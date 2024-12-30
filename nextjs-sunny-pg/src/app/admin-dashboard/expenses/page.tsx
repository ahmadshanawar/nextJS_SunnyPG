"use client";
import { useState, useEffect, Fragment } from "react";
import { supabase } from "@/lib/supabase";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import Loader from "react-js-loader";
import useUserStore from "@/lib/store/userStore";
import {
  FaPlus,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
} from "react-icons/fa";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import DateSelector from "@/app/components/DateSelector";

interface Expense {
  id: string;
  created_at: string;
  category: string;
  item: string;
  date: string;
  amount: string;
  uid: string;
  tennant: {
    name: string;
  };
}

const categoryOptions = [
  "Electricity",
  "Plumbing",
  "Sweeper",
  "Carpenter",
  "House Tax",
  "Electricity Bill",
  "Painting",
  "Others",
];

const ExpensesPage = () => {
  const { userId } = useUserStore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    item: "",
    date: "",
    amount: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Expenses")
      .select(`*, tennant:uid (name)`)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
    } else {
      setExpenses(data);
    }
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async () => {
    const { category, item, date, amount } = newExpense;
    if (!category || !item || !date || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const { data, error } = await supabase
      .from("Expenses")
      .insert([{ category, item, date, amount, uid: userId }]);

    if (error) {
      console.error("Error adding expense:", error);
    } else {
      setNewExpense({ category: "", item: "", date: "", amount: "" });
      fetchExpenses();
      setIsDialogOpen(false);
    }
  };

  const handleSearch = () => {
    fetchExpenses();
  };

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortExpenses(key, direction);
  };

  const sortExpenses = (key: string, direction: string) => {
    const sortedExpenses = [...expenses].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setExpenses(sortedExpenses);
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig) return <FaSort className="text-lg ml-1" />;
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending")
        return <FaSortUp className="text-lg ml-1" />;
      if (sortConfig.direction === "descending")
        return <FaSortDown className="text-lg ml-1" />;
    }
    return <FaSort className="text-lg ml-1" />;
  };

  const calculateTotalAmount = () => {
    return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  };

  return (
    <div className="container mx-auto p-4 w-screen">
      <div className="flex justify-end">
        <h1 className="text-2xl font-semibold">Expenses</h1>
      </div>
      <hr className="mb-2" />
      <div className="flex items-center justify-between">
        <div className="md:flex md:items-center md:justify-end">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="text-gray-700 px-3 py-2 rounded-md flex items-center border border-gray-200 bg-gray-100"
          >
            <FaPlus className="text-md mr-1" />
          </button>
        </div>
        <div
          className={`${
            isFilterOpen ? "block" : "hidden"
          } sm:flex sm:items-center sm:space-x-4`}
        >
          <div className="mr-2">
            <DateSelector
              value={startDate ? parseISO(startDate) : null}
              onChange={(date) => setStartDate(date)}
              label="Start Date"
            />
          </div>
          <div className="mr-2">
            <DateSelector
              value={endDate ? parseISO(endDate) : null}
              onChange={(date) => setEndDate(date)}
              label="End Date"
            />
          </div>
          <div className="mt-6">
            <button
              onClick={handleSearch}
              className="mr-2 flex flex-row items-center bg-purple-800 hover:bg-purple-700 text-white px-2 py-2 rounded-md"
            >
              Search
              <FaSearch className="ml-2" />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-end">
          <div
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex justify-end sm:hidden"
          >
            <button className="text-gray-700 px-1 py-1 ml-1 rounded-md flex items-center border border-gray-200 bg-gray-100">
              <span className="ml-2">
                <FaFilter className="text-md" />
              </span>
              <div className="mt-2">
                {isFilterOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full h-[calc(100vh-200px)]">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4  overflow-y-auto">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add Expense
                  </h3>
                  <hr />
                  <div className="mt-2">
                    <div className="mr-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <select
                        name="category"
                        value={newExpense.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple-800"
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mr-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Item
                      </label>
                      <input
                        type="text"
                        name="item"
                        value={newExpense.item}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple-800"
                      />
                    </div>
                    <div className="mr-2">
                      <DateSelector
                        value={newExpense.date ? parseISO(newExpense.date) : null}
                        onChange={(date) =>
                          setNewExpense((prev) => ({
                            ...prev,
                            date: date ? format(date, "yyyy-MM-dd") : "",
                          }))
                        }
                        label="Date"
                      />
                    </div>
                    <div className="mr-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={newExpense.amount}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-800 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleAddExpense}
              >
                Add Expense
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="mt-3 overflow-x-auto max-h-[calc(100vh-200px)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("date")}
                >
                  <div className="flex items-center">Date {getSortIcon("date")}</div>
                </th>
                <th
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("category")}
                >
                  <div className="flex items-center">
                    Category {getSortIcon("category")}
                  </div>
                </th>
                <th
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("item")}
                >
                  <div className="flex items-center">Item {getSortIcon("item")}</div>
                </th>
                <th
                  className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("amount")}
                >
                  <div className="flex items-center">
                    Amount {getSortIcon("amount")}
                  </div>
                </th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Added By</div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                    {format(parseISO(expense.date), "dd-MMM-yyyy")}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                    {expense.category}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                    {expense.item}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                    {expense.amount}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                    {expense.tennant.name}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={3}
                  className="px-2 py-2 text-right text-sm font-medium text-gray-900"
                >
                  Total:
                </td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">
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

export default ExpensesPage;
