import React from "react";
import { Users, Flame, Trophy, Award } from "lucide-react";

export default function StatsMarquee() {
  const stats = [
    { num: "500+", label: "Active Disciplined Members", icon: Users },
    { num: "40+", label: "Weekly Elite Sessions", icon: Flame },
    { num: "12", label: "Championship Coaches", icon: Trophy },
    { num: "98%", label: "Trial-to-Member Conversion", icon: Award },
    { num: "15,000", label: "Sq Ft High Performance Facility", icon: Flame },
  ];

  return (
    <section className="relative bg-[#111111] border-y border-white/10 py-10 overflow-hidden select-none">
      {/* Decorative gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#111111] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#111111] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee">
        {[...stats, ...stats, ...stats].map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-6 px-12 border-r border-white/10 shrink-0 group cursor-default"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-white/40 group-hover:bg-white/10 transition-colors">
                <Icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-4xl lg:text-5xl text-white tracking-tight group-hover:scale-105 transition-transform origin-left">
                  {st.num}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#8C8C8C] mt-0.5">
                  {st.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
