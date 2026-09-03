import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Flame, ArrowRight, Check } from "lucide-react";
import { useGym } from "../../context/GymContext";
import Reveal from "../common/Reveal";

export default function MembershipSection() {
  const { memberships } = useGym();

  return (
    <section className="bg-[#0D0D0D] py-32 px-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Reveal */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#8C8C8C] inline-block">
              Commitment Standard
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-none">
              CHOOSE YOUR DISCIPLINE.<br />
              <span className="text-[#8C8C8C]">HONOR YOUR WORD.</span>
            </h2>
            <p className="text-sm text-[#8C8C8C] leading-relaxed">
              No initiation fees. No hidden cancel charges. Simply rigorous training alongside people who push their thresholds daily.
            </p>
          </div>
        </Reveal>

        {/* Pricing Cards Grid with Staggered Reveals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {memberships.map((plan, idx) => {
            const isPopular = plan.popular;
            return (
              <Reveal key={plan.id} delay={0.1 + idx * 0.12} className="flex">
                <div
                  className={`relative rounded-sm p-8 flex flex-col justify-between w-full transition-all duration-300 border ${
                    isPopular
                      ? "bg-[#161616] border-white shadow-[0_0_40px_rgba(255,255,255,0.1)] -translate-y-2 hover:-translate-y-3"
                      : "bg-[#121212] border-white/10 hover:border-white/30 hover:-translate-y-1"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Flame className="w-3 h-3 fill-black" />
                      Athlete Recommended
                    </div>
                  )}

                  {/* Card Top */}
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C]">
                        Tier Classification
                      </span>
                      <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight mt-1">
                        {plan.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl font-extrabold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-[#8C8C8C]">
                        / {plan.interval}
                      </span>
                    </div>

                    <p className="text-xs text-[#8C8C8C] leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Feature Checklist */}
                    <div className="space-y-3 pt-6 border-t border-white/10">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white block">
                        Includes Privileges:
                      </span>
                      <ul className="space-y-2.5">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-white/80">
                            <Check className="w-4 h-4 shrink-0 text-white mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card CTA */}
                  <div className="pt-8 mt-8 border-t border-white/10">
                    <Link
                      to="/pricing"
                      className={`w-full py-4 rounded-sm text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        isPopular
                          ? "bg-white text-black hover:bg-[#F5F5F3] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
                          : "border border-white/20 text-white hover:bg-white hover:text-black"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <Reveal delay={0.35}>
          <div className="mt-16 p-6 rounded-sm bg-[#121212] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8C8C]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>All memberships include free locker usage, cold-brew bar, and towel service.</span>
            </div>
            <Link to="/contact" className="text-white hover:underline uppercase tracking-wider font-semibold">
              Inquire For Corporate or Team Rates →
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
