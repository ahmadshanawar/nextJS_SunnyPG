import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { differenceInDays, addMonths, format, parseISO } from "date-fns";
import Loader from "react-js-loader";
import { FaXmark, FaTrash, FaFloppyDisk } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";

interface TenantPaymentEditDialogProps {
  uid: string;
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentDetails {
  pay_id: string;
  billing_start_date: string;
  billing_end_date: string;
  amount: number;
  paid: boolean;
  paid_on?: string;
}

const TenantPaymentEditDialog: React.FC<TenantPaymentEditDialogProps> = ({
  uid,
  isOpen,
  onClose,
}) => {
  const [paymentData, setPaymentData] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [editedRows, setEditedRows] = useState<{ [key: string]: boolean }>({});

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Payments")
      .select("*")
      .eq("uid", uid)
      .order("billing_start_date", { ascending: true });

    if (error) {
      console.error("Error fetching payment data:", error);
    } else {
      setPaymentData(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (uid && isOpen) {
      fetchData();
    }
  }, [uid, isOpen]);

  const handleInputChange = (pay_id: string, field: string, value: any) => {
    const updatedData = paymentData.map((payment) =>
      payment.pay_id === pay_id ? { ...payment, [field]: value } : payment
    );
    setPaymentData(updatedData);
    setEditedRows({ ...editedRows, [pay_id]: true });
  };

  const handleSave = async (pay_id: string) => {
    const row = paymentData.find((payment) => payment.pay_id === pay_id);
    if (row) {
      const updatedRow = { ...row, paid_on: format(new Date(), "yyyy-MM-dd"), uid };
      const { error } = await supabase
        .from("Payments")
        .update(updatedRow)
        .eq("pay_id", pay_id);

      if (error) {
        console.error("Error updating payment data:", error);
      } else {
        setEditedRows({ ...editedRows, [pay_id]: false });
        if (paymentData[paymentData.length - 1].pay_id === pay_id) {
          const newStartDate = parseISO(row.billing_end_date);
          const newEndDate = addMonths(newStartDate, 1);
          const newRow = {
            pay_id: uuidv4(),
            billing_start_date: format(newStartDate, "yyyy-MM-dd"),
            billing_end_date: format(newEndDate, "yyyy-MM-dd"),
            amount: row.amount,
            paid: false,
            uid,
          };
          const { error: insertError } = await supabase
            .from("Payments")
            .insert(newRow);
          fetchData();
          if (insertError) {
            console.error("Error inserting new payment data:", insertError);
          } else {
            setPaymentData([...paymentData, newRow]);
          }
        }
      }
    }
  };

  const handleDelete = async (pay_id: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      const { error } = await supabase
        .from("Payments")
        .delete()
        .eq("pay_id", pay_id);

      if (error) {
        console.error("Error deleting payment data:", error);
      } else {
        const updatedData = paymentData.filter(
          (payment) => payment.pay_id !== pay_id
        );
        setPaymentData(updatedData);
      }
    }
  };

  const isRowValid = (payment: PaymentDetails) => {
    return (
      payment.billing_start_date &&
      payment.billing_end_date &&
      payment.amount > 0 &&
      payment.paid !== false
    );
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          {loading ? (
            <Loader
              type="hourglass"
              bgColor={"#7c3ab3"}
              color={"#828282"}
              title={"Loading..."}
              size={60}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl h-3/4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Payment Details</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaXmark />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Billing Start Date
                      </th>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Billing End Date
                      </th>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount(₹)
                      </th>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number of Days
                      </th>
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid On
                      </th>
                      <th className="px-4 py-2 bg-gray-50"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentData.map((payment, index) => {
                      const daysDifference = differenceInDays(
                        parseISO(payment.billing_end_date),
                        parseISO(payment.billing_start_date)
                      );
                      return (
                        <tr key={payment.pay_id}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <input
                              className="border rounded p-1"
                              type="date"
                              value={payment.billing_start_date}
                              onChange={(e) =>
                                handleInputChange(
                                  payment.pay_id,
                                  "billing_start_date",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <input
                              className="border rounded p-1"
                              type="date"
                              value={payment.billing_end_date}
                              onChange={(e) =>
                                handleInputChange(
                                  payment.pay_id,
                                  "billing_end_date",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <input
                              min={0}
                              className="border rounded p-1"
                              type="number"
                              value={payment.amount}
                              onChange={(e) =>
                                handleInputChange(
                                  payment.pay_id,
                                  "amount",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <select
                              className="border rounded p-1"
                              value={payment.paid ? "Paid" : "Pending"}
                              onChange={(e) =>
                                handleInputChange(
                                  payment.pay_id,
                                  "paid",
                                  e.target.value === "Paid"
                                )
                              }
                            >
                              <option value="Paid">Paid</option>
                              <option value="Pending">Pending</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {daysDifference}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {payment.paid_on
                              ? format(parseISO(payment.paid_on), "MM-dd-yyyy")
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                onClick={() => handleSave(payment.pay_id)}
                                className={
                                  !editedRows[payment.pay_id] || !isRowValid(payment)
                                    ? "text-gray-500"
                                    : "text-green-500 hover:text-green-700"
                                }
                                disabled={
                                  !editedRows[payment.pay_id] || !isRowValid(payment)
                                }
                              >
                                <FaFloppyDisk className="text-2xl" />
                              </button>
                              <button
                                disabled={paymentData.length === 1}
                                onClick={() => handleDelete(payment.pay_id)}
                                className={
                                  paymentData.length === 1
                                    ? "text-gray-500 ml-2"
                                    : `text-red-500 hover:text-red-700 ml-2`
                                }
                              >
                                <FaTrash className="text-xl" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TenantPaymentEditDialog;
