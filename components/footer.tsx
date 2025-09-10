import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const footerLinks = [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Refund Policy", href: "/refund" },
    { title: "Shipping Policy", href: "/shipping-policy" },
    { title: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-zinc-900 text-orange-100/70 py-12 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-white mb-2">Sendify</h2>
          <p className="text-sm">Real-time notifications for NextJS & ReactJS applications</p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          {footerLinks.map((link, index) => (
            <Link key={index} href={link.href} className="text-orange-300 hover:text-orange-500 transition-colors duration-200 text-sm">
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-orange-100/50">
        &copy; {new Date().getFullYear()} Sendify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;