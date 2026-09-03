import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Award, Quote } from "lucide-react";
import { useGym } from "../../context/GymContext";
import Reveal from "../common/Reveal";

export default function TrainersRoster() {
  const { trainers } = useGym();
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const offset = direction === "left" ? -clientWidth * 0.7 : clientWidth * 0.7;
      scrollContainerRef.current.scrollTo({ left: scrollLeft + offset, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#111111] py-32 px-6 border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Reveal */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#8C8C8C] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Elite Faculty
              </span>
              <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-none">
                TRAINED BY THOSE<br />
                <span className="text-[#8C8C8C]">WHO HAVE BEEN IN THE RING.</span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll("left")}
                aria-label="Previous coach"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Next coach"
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Horizontal Drag & Scroll Roster */}
        <Reveal delay={0.15}>
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {trainers.map((trainer, idx) => (
              <div
                key={trainer.id}
                className="min-w-[300px] sm:min-w-[380px] lg:min-w-[420px] bg-[#161616] border border-white/10 rounded-sm overflow-hidden flex flex-col snap-start group hover:border-white/30 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale contrast-125 filter group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/20" />

                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[11px] uppercase tracking-wider text-white/90 border border-white/10">
                    {trainer.role}
                  </div>
                </div>

                {/* Info Details */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                      {trainer.name}
                    </h3>
                    <p className="text-xs text-[#8C8C8C] mt-1 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-white/50" />
                      {trainer.creds}
                    </p>
                  </div>

                  {/* Specialties Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] tracking-wider uppercase px-2.5 py-1 bg-white/5 text-white/80 rounded border border-white/10"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Trainer Quote */}
                  <div className="pt-4 border-t border-white/10 text-xs italic text-[#8C8C8C] flex gap-2">
                    <Quote className="w-4 h-4 shrink-0 text-white/30" />
                    <span>"{trainer.quote}"</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Call to action bar */}
        <Reveal delay={0.25}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between p-6 bg-[#161616] border border-white/10 rounded-sm gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="text-xs uppercase tracking-widest text-white">
                Private 1-on-1 athletic consultations available weekly
              </span>
            </div>
            <Link
              to="/trainers"
              className="text-xs uppercase tracking-widest font-bold text-white hover:underline flex items-center gap-2"
            >
              Meet Full Faculty <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
