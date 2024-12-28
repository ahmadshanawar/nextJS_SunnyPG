import React, { useState } from "react";

const TermsAndConditions: React.FC<{ onClose: (value: boolean) => void }> = ({
  onClose,
}) => {
  const closeDialog = () => onClose(false);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={closeDialog}
        ></div>
        <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl w-full z-50 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-center">Terms and Conditions</h3>
            <button
              onClick={closeDialog}
              className="text-gray-600 text-3xl hover:text-gray-800 focus:outline-none"
            >
              &times;
            </button>
          </div>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">1. General Rules</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                The Hostel reserves the right to admission. A valid government-issued
                photo ID (e.g., Aadhaar, PAN Card, Passport) is mandatory for
                check-in.
              </li>
              <li>
                Residents must adhere to Indian laws and Hostel policies at all
                times. Illegal activities, including substance abuse or possession of
                prohibited items, are strictly prohibited.
              </li>
              <li>
                The Hostel is for the accommodation of male students and
                professionals only. Subletting or transferring rooms to third parties
                is not permitted.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">2. Check-in and Check-out</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Check-in time at night is 11:30PM</li>
              <li>
                Residents must vacate their rooms upon completion of their agreed
                stay unless an extension is approved by the Hostel management.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">3. Payment Terms</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Rent must be paid on or before the 5th of every month. Late payment
                will lead to termination from the hostel and its services.
              </li>
              <li>
                A security deposit equivalent to 4000 INR or one month's rent is
                required at the time of booking. This deposit is refundable upon
                check-out, subject to deductions for damages or unpaid dues.
              </li>
              <li>
                All payments should be made via UPI or Cash. Receipts will be
                provided for every payment
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              4. Room Allocation and Maintenance
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Rooms are allocated at the discretion of the Hostel management. Room
                changes are subject to approval and availability.
              </li>
              <li>
                Residents are responsible for keeping their rooms and common areas
                clean and tidy. Garbage must be disposed of in designated areas.
              </li>
              <li>
                Any damage to Hostel property, including furniture, fixtures, or
                appliances, will be charged to the resident responsible. Intentional
                damage may result in eviction and forfeiture of the security deposit.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">5. Safety and Security</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Residents are required to lock their rooms and safeguard their
                personal belongings. The Hostel is not liable for theft, loss, or
                damage to personal items.
              </li>
              <li>
                Any late-night entry must be pre-approved by the management.
                Unauthorized late entry not allowed
              </li>
              <li>
                Guests or friends of residents are not permitted to stay overnight
                unless expressly authorized by the Hostel management.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">6. Code of Conduct</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Noise levels must be kept to a minimum, especially during quiet hours
              </li>
              <li>
                Harassment, bullying,Ragging or any form of discrimination is
                strictly prohibited. Violations will result in immediate expulsion
                and legal action if necessary.
              </li>
              <li>
                Alcohol consumption, smoking, and the use of narcotics or other
                illegal substances within Hostel premises are prohibited and will be
                taken seriously.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">7. Meals and Utilities</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Meals, if provided, will be served at designated times. Complaints
                about food quality or requests for changes must be directed to the
                management.
              </li>
              <li>
                Electricity, water, and Wi-Fi usage are included in the rent unless
                otherwise specified. Misuse of utilities, including excessive use of
                electricity or tampering with switchboards oe any other such devices,
                may result in additional charges or penalties.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">8. Termination of Stay</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                The Hostel management reserves the right to terminate a resident’s
                stay for breach of these Terms or inappropriate behavior. No refunds
                will be provided in such cases.
              </li>
              <li>
                Residents wishing to vacate must provide at least 15 days prior
                notice. Failure to do so may result in forfeiture of the security
                deposit.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">9. Force Majeure</h2>
            <p className="mb-4">
              The Hostel is not liable for interruptions in services (electricity,
              water, etc.) due to events beyond its control, including natural
              disasters, strikes, or governmental actions. Backup by generator is
              available for electricity only in emergenecy casesas per hostel
              management.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">10. Amendments</h2>
            <p className="mb-4">
              The Hostel reserves the right to amend these Terms at any time.
              Residents will be notified of any changes Continued stay constitutes
              acceptance of the amended Terms.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">11. Dispute Resolution</h2>
            <p className="mb-4">
              Any disputes arising from these Terms will be governed by the laws of
              India and subject to the exclusive jurisdiction of courts in Lucknow
              only
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4">For queries or assistance, please contact:</p>
            <ul className="list-disc list-inside space-y-2">
              <strong>Hostel Manager</strong>: Akhilesh / Sunny
              <hr />
              <strong>Phone</strong>: 9005942890 / 8147335246
              <hr />
              <strong>Address</strong>:76/1 Sunny Hostel and PG,Atif Vihar, Opposite
              BBD University, Lucknow, Uttar Pradesh
              <hr />
            </ul>
          </section>

          <div className="flex justify-end mt-6">
            <button
              onClick={closeDialog}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
