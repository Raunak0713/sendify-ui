import React from "react";

const ShippingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-orange-100 px-6 py-16 flex justify-center items-start">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-white">Shipping Policy</h1>

        <p className="mb-4 text-orange-100/70">
          All our products and services are delivered digitally. We do not ship physical products or merchandise. Once payment is confirmed, you will receive access via your account or the registered email.
        </p>

        <p className="mb-4 text-orange-100/70">
          For digital services, delivery is typically instant. You will be able to access your purchased service immediately or within a few minutes after successful payment.
        </p>

        <p className="mb-4 text-orange-100/70">
          In case you face any issues with digital delivery, such as not receiving access, broken links, or technical errors, please contact our support team at{" "}
          <a href="mailto:support@sendify.100xbuild.com" className="text-orange-400 underline">
            support@sendify.100xbuild.com
          </a>. We aim to respond and resolve all issues within 24-48 hours.
        </p>

        <p className="mb-4 text-orange-100/70">
          Please note that since all products are digital, no refunds or returns apply unless there is a technical issue preventing delivery. For more details, refer to our Refund & Cancellation Policy.
        </p>

        <ul className="list-disc list-inside mb-4 text-orange-100/70">
          <li>All products/services are digital and delivered online.</li>
          <li>No physical shipment or mailing is involved.</li>
          <li>Support contact is available for delivery issues.</li>
        </ul>

        <p className="mt-8 text-sm text-orange-100/50">
          &copy; {new Date().getFullYear()} Sendify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ShippingPage;