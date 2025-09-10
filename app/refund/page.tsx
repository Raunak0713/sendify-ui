import React from "react";

const RefundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-orange-100 px-6 py-16 flex justify-center items-start">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-white">Refund & Cancellation Policy</h1>
        <p className="mb-4 text-orange-100/70">
          Payments for digital services/products are generally non-refundable. However, if you face technical issues, contact us within 7 days for resolution.
        </p>
        <p className="mb-4 text-orange-100/70">
          We reserve the right to review refund requests on a case-by-case basis.
        </p>
        <p className="mt-8 text-sm text-orange-100/50">
          &copy; {new Date().getFullYear()} Sendify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RefundPage;