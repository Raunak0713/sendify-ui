"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

const HeroSection = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("npm i sendify");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-white/85 flex flex-col items-center justify-center min-h-screen px-6 md:px-32 ">
      <span className="border border-white/20 rounded-lg bg-blue-100/10 shadow-lg p-1 text-xs md:text-base mt-10 ">
        The Simplest Plug & Play Real-Time Notifications
      </span>
      <div className="mt-10 text-center text-3xl md:text-5xl mb-10">
        Your One Stop Solution for ReactJS and NextJS Real-Time Notifications
      </div>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-500 to-zinc-900 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
        <div className="relative flex items-center gap-2 bg-zinc-900/90 border border-white/10 rounded-xl shadow-2xl px-4 py-3">
          <div className="flex items-center space-x-2">
            <span className="text-purple-400">$</span>
            <code className="font-mono text-sm md:text-base text-white">npm i sendify</code>
          </div>
          <button
            onClick={copyToClipboard}
            className="ml-4 p-1.5 rounded-md transition-all duration-200 hover:bg-white/10 text-white/70 hover:text-white"
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      {copied && <div className="mt-2 text-xs text-green-400 animate-fade-in-out">Copied to clipboard!</div>}
      
      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-6 text-center w-full max-w-4xl md:max-w-5xl p-8 md:px-4">
        <div className="p-4 bg-zinc-900/80 border border-white/10 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">⚡ Instant Notifications</h3>
          <p className="text-white/70 mt-2 text-sm">Deliver real-time updates with zero delay across your application.</p>
        </div>
        <div className="p-4 bg-zinc-900/80 border border-white/10 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">🔧 Easy Integration</h3>
          <p className="text-white/70 mt-2 text-sm">Plug & play with minimal configuration, works seamlessly with React & Next.js.</p>
        </div>
        <div className="p-4 bg-zinc-900/80 border border-white/10 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white">📡 Scalable & Reliable</h3>
          <p className="text-white/70 mt-2 text-sm">Built for modern web apps, ensuring stability and performance at scale.</p>
        </div>
      
      </div>
      
      {/* Footer */}
      <footer className="mt-16 py-6 text-center text-white/60 text-sm border-t border-white/10 w-full">
        Made with ❤️ by Sendify | © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  );
};

export default HeroSection;
