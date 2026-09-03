import React from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowRight, Shield } from "lucide-react";
import Reveal from "../common/Reveal";

export default function CallToAction() {
  return (
    <section className="relative bg-[#0D0D0D] py-32 px-6 overflow-hidden">
      
      {/* Background Graphic Texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
        
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 bg-white/5 text-xs uppercase tracking-widest text-white">
            <Flame className="w-3.5 h-3.5 text-white" />
            Zero Gimmicks · Pure Athletic Execution
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.92]">
            ARE YOU READY<br />
            <span className="text-[#8C8C8C]">TO BE BRAVE?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#8C8C8C] leading-relaxed">
            Step inside the ring or under the barbell. Experience 3 full coaching sessions with our standard trial pass. No commitments, just pure work.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/pricing"
              className="w-full sm:w-auto px-10 py-5 bg-white text-black font-display font-bold text-sm tracking-wider uppercase rounded-sm hover:bg-[#F5F5F3] transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center justify-center gap-3"
            >
              Claim 3-Class Trial Pass ($39)
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white font-display font-semibold text-sm tracking-wider uppercase rounded-sm hover:bg-white/5 transition-all"
            >
              Schedule Facility Tour
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="pt-8 text-xs text-[#8C8C8C] flex items-center justify-center gap-6 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-white" /> Instant Confirmation</span>
            <span>•</span>
            <span>Wraps & Gloves Included</span>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
