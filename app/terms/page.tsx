import React from "react";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-orange-100 px-6 py-16 flex justify-center items-start">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-white">Terms & Conditions</h1>
        <p className="mb-4 text-orange-100/70">
          By using Sendify, you agree to use our services responsibly and not misuse them in any way. We reserve the right to suspend or terminate access in case of misuse.
        </p>
        <p className="mb-4 text-orange-100/70">
          All software and services are provided "as is" without warranties. We are not liable for any direct or indirect damages arising from use.
        </p>
        <p className="mt-8 text-sm text-orange-100/50">
          &copy; {new Date().getFullYear()} Sendify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;