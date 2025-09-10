import React from "react";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-orange-100 px-6 py-16 flex justify-center items-start">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-white">Contact Us</h1>
        <p className="mb-4 text-orange-100/70">
          For any questions, support, or issues, feel free to reach out to us:
        </p>
        <ul className="mb-4 text-orange-100/70 list-disc list-inside">
          <li>Email: <a href="mailto:support@sendify.100xbuild.com" className="text-orange-400 underline">support@sendify.100xbuild.com</a></li>
        </ul>
        <p className="mb-4 text-orange-100/70">
          We aim to respond within 24-48 hours.
        </p>
        <p className="mt-8 text-sm text-orange-100/50">
          &copy; {new Date().getFullYear()} Sendify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;