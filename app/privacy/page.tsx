import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-orange-100 px-6 py-16 flex justify-center items-start">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
        <p className="mb-4 text-orange-100/70">
          We respect your privacy. Any information collected is only used to process payments and improve our service. We do not share your data with third parties.
        </p>
        <p className="mb-4 text-orange-100/70">
          For questions, contact us at{" "}
          <a href="mailto:support@sendify.100xbuild.com" className="text-orange-400 underline">
            support@sendify.100xbuild.com
          </a>.
        </p>
        <p className="mt-8 text-sm text-orange-100/50">
          &copy; {new Date().getFullYear()} Sendify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;