import React from "react";

const ShippingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-orange-100 px-6 py-16 flex justify-center items-start">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-white">Shipping Policy</h1>
        <p className="mb-4 text-orange-100/70">
          We do not ship physical products. All our services and products are delivered digitally via the website or email.
        </p>
        <p className="mb-4 text-orange-100/70">
          If you encounter any delivery issues, please contact our support team for assistance.
        </p>
        <p className="mt-8 text-sm text-orange-100/50">
          &copy; {new Date().getFullYear()} Sendify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ShippingPage;