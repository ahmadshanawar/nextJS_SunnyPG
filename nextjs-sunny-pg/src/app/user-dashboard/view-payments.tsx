import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { differenceInDays, format, parseISO } from "date-fns";
import Loader from "react-js-loader";

interface ViewPaymentsProps {
  uid: string;
}

interface PaymentDetails {
  pay_id: string;
  billing_start_date: string;
  billing_end_date: string;
  amount: number;
  paid: boolean;
  paid_on?: string;
}

const ViewPayments: React.FC<ViewPaymentsProps> = ({ uid }) => {
  const [paymentData, setPaymentData] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);

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
    if (uid) {
      fetchData();
    }
  }, [uid]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl h-3/4 overflow-y-auto">
      {loading ? (
        <Loader
          type="hourglass"
          bgColor={"#7c3ab3"}
          color={"#828282"}
          title={"Loading..."}
          size={60}
        />
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <hr className="my-3" />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Period
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentData.map((payment) => {
                  const daysDifference = differenceInDays(
                    parseISO(payment.billing_end_date),
                    parseISO(payment.billing_start_date)
                  );
                  return (
                    <tr key={payment.pay_id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {format(parseISO(payment.billing_start_date), "dd-MMM-yyyy")}{" "}
                        ⇔ {format(parseISO(payment.billing_end_date), "dd-MMM-yyyy")}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {payment.amount}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.paid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.paid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {daysDifference}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {payment.paid_on
                          ? format(parseISO(payment.paid_on), "dd-MMM-yyyy")
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewPayments;
