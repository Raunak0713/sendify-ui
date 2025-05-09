import Link from "next/link";
import React from "react";

const HeroSection: React.FC = () => {

  const features = [
    { title: "Instant Delivery", description: "Send notifications instantly with real-time delivery.", icon: "⚡" },
    { title: "Customizable UI", description: "Fully customize notifications to match your brand.", icon: "🎨" },
    { title: "Multi-platform", description: "Works seamlessly across web, mobile, and desktop.", icon: "📱" },
    { title: "User Targeting", description: "Send notifications to specific users or segments.", icon: "🎯" },
    { title: "Analytics", description: "Track delivery, open rates, and engagement.", icon: "📊" },
    { title: "Real-time WebSockets", description: "Powered by WebSockets for instant updates without delays.", icon: "🔄" },
  ];
  

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-6 bg-zinc-900">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow" />
        <div className="absolute top-1/3 right-20 w-64 h-64 bg-amber-400/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow animation-delay-500" />
        <div className="absolute bottom-32 -left-12 w-72 h-72 bg-orange-300/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow animation-delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-1.5  rounded-full bg-orange-100/10 dark:bg-orange-900/40 text-orange-500 text-xs md:text-sm font-medium animate-fade-in">
          Real-time notifications for NextJS and ReactJS
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-white mt-10">
          Elevate User Experience with{" "}
          <span className="bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Sendify
          </span>
        </h1>

        <p className="text-xl text-orange-100/70 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
          A lightweight, customizable notification library that seamlessly integrates with ReactJS and NextJS applications.
        </p>


        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href={"/dashboard/projects"}>
            <button className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-black font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]">
              Get Started
            </button>
          </Link>
          <Link href={"https://docs.sendify.100xbuild.com"}>
            <button className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-zinc-800 text-orange-100 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:scale-[1.02] active:scale-[0.98]">
              Documentation
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full mt-20 overflow-hidden">
        <h2 className="text-center text-3xl font-bold mb-8 text-white">Features</h2>

        {/* Desktop view (Static Grid) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {features.map((feature, index) => (
            <div key={`desktop-${index}`} className="rounded-2xl bg-zinc-800/80 dark:bg-zinc-800/60 border border-orange-500/20 p-6 transition-all duration-300 hover:shadow-elevation hover:translate-y-[-2px] hover:shadow-orange-500/10 relative overflow-hidden">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-orange-100/10 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2 text-white">{feature.title}</h3>
              <p className="text-orange-100/70">{feature.description}</p>

              {/* Subtle background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent dark:from-orange-900/5 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Mobile view (Scrolling one by one) */}
        <div className="md:hidden w-full overflow-x-auto">
          <div className="flex gap-4 px-4 py-2 w-max scroll-smooth snap-x snap-mandatory">
            {features.map((feature, index) => (
              <div
                key={`mobile-${index}`}
                className="feature-card flex-shrink-0 w-80 rounded-2xl bg-zinc-800/80 dark:bg-zinc-800/60 border border-orange-500/20 p-6 relative overflow-hidden snap-center"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-orange-100/10 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">{feature.title}</h3>
                <p className="text-orange-100/70">{feature.description}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent dark:from-orange-900/5 rounded-2xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    
    </section>
  );
};

export default HeroSection;
