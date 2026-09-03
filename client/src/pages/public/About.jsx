import React from "react";
import { Link } from "react-router-dom";
import { Shield, Target, Compass, Award } from "lucide-react";

export default function About() {
  const pillars = [
    {
      title: "Raw Effort Over Performance Theater",
      desc: "We don't do gimmicks or trend-driven fitness choreography. We train fundamental human capacities: force production, striking accuracy, aerobic density, and mental fortitude.",
      icon: Target
    },
    {
      title: "Coach-Led Rigor",
      desc: "Every athlete is known by name and metric. Our coaches provide real-time cueing, physiological awareness, and technical feedback on every repetition.",
      icon: Award
    },
    {
      title: "Community of Discipline",
      desc: "There are no spectators in our room. When you enter Brave Gym, you commit to mutual respect, personal accountability, and showing up even when you'd rather not.",
      icon: Shield
    }
  ];

  return (
    <div className="pt-28 pb-32 bg-[#0D0D0D] min-h-screen px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#8C8C8C] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Foundational Ethos
            </span>
            <h1 className="font-display text-5xl sm:text-7xl font-extrabold text-white tracking-tight uppercase leading-[0.95]">
              COURAGE IS A<br />
              <span className="text-[#8C8C8C]">PHYSICAL PRACTICE.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed">
              Brave Gym was founded on a singular premise: the modern world has eliminated friction, but friction is the exact condition required for growth. We created a sanctuary where athletes can test their limits against hard steel, leather bags, and honest peers.
            </p>
            <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed">
              Whether you are an aspiring amateur boxer, a competitive master lifter, or someone reclaiming their physical sovereignty, the standard remains identical: Show up. Be brave. Do the work.
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-[3/4] rounded-sm overflow-hidden border border-white/10">
            <img
              src="/media/hermes-rivera-qbf59TU077Q-unsplash.jpg"
              alt="Brave Gym Facility"
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs font-mono uppercase tracking-widest text-white/60">HQ Sanctuary</span>
              <h3 className="font-display text-2xl font-bold text-white uppercase">District 04 Arena</h3>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C]">Core Doctrine</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase">
              The Three Tenets of Brave
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div key={idx} className="p-8 bg-[#141414] border border-white/10 rounded-sm space-y-4">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white uppercase">{pil.title}</h3>
                  <p className="text-xs sm:text-sm text-[#8C8C8C] leading-relaxed">{pil.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
