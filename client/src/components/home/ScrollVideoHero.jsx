import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, Flame, Shield, ArrowUpRight, Volume2, VolumeX, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export default function ScrollVideoHero() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});

    let scrollTimeout = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!containerRef.current || !video) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableDistance = rect.height - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollableDistance, 0), 1);
      setScrollProgress(progress);

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        const currentScrollY = window.scrollY;
        const delta = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        if (video.paused) {
          video.play().catch(() => {});
        }

        if (delta > 8) {
          video.playbackRate = Math.min(1.0 + delta * 0.04, 2.5);
        } else {
          video.playbackRate = 1.0;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (video && !video.paused) {
            video.playbackRate = 0.7;
          }
        }, 300);
      } else {
        if (!video.paused && (rect.bottom < 0 || rect.top > window.innerHeight)) {
          video.pause();
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const headlineWords = ["BE", "BRAVE.", "TRAIN", "HARD."];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0D0D0D]"
      style={{ height: "190vh" }}
    >
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            src="/media/boxing-hero.mp4"
            poster="/media/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg"
            preload="auto"
            muted={isMuted}
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover object-center grayscale contrast-125 filter brightness-80 scale-[1.02] transition-all duration-300"
          />

          {/* Dynamic dark vignette overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/30 to-[#0D0D0D]/60 transition-opacity duration-300"
            style={{
              opacity: 0.4 + scrollProgress * 0.4
            }}
          />

          {/* Cinematic Radial Shadow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        </div>

        {/* Top Spacer for Navbar (compact to give content room) */}
        <div className="h-16 sm:h-20 shrink-0" />

        {/* Hero Content Layer - Perfectly centered vertically */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-2 my-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          
          {/* Main Editorial Headline */}
          <div className="space-y-4 sm:space-y-5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[11px] tracking-widest uppercase text-white shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Sanctuary of Discipline · District 04</span>
            </div>

            <h1 className="font-display font-extrabold text-white text-[clamp(2.5rem,7.5vw,6.5rem)] leading-[0.92] tracking-tighter uppercase select-none">
              {headlineWords.map((word) => (
                <span
                  key={word}
                  style={{
                    display: "inline-block",
                    marginRight: "1rem",
                    transition: "transform 0.4s ease-out",
                  }}
                  className={`hover:scale-105 transition-transform ${
                    word === "BRAVE." ? "text-stroke hover:text-white" : ""
                  }`}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className="text-[#8C8C8C] text-sm sm:text-base font-normal max-w-xl leading-relaxed">
              Brave Gym is an uncompromising sanctuary of raw effort, heavy leather, and disciplined human performance.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/pricing"
                className="px-7 py-3.5 bg-white text-black font-semibold text-xs tracking-wider uppercase rounded-sm hover:bg-[#F5F5F3] transition-all hover:scale-105 shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center gap-2"
              >
                <Flame className="w-3.5 h-3.5 fill-black" />
                Book Trial Class ($39)
              </Link>
              <Link
                to="/programs"
                className="px-7 py-3.5 border border-white/30 text-white font-semibold text-xs tracking-wider uppercase rounded-sm hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Explore Disciplines
              </Link>
            </div>
          </div>

          {/* Right Side: Clean Editorial Facility Badge */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 max-w-xs shrink-0">
            
            <div className="bg-[#141414]/90 backdrop-blur-md p-5 rounded-sm border border-white/15 space-y-3 shadow-2xl w-full">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C]">
                  Athletic Standard
                </span>
                <span className="flex items-center gap-1 text-[11px] text-white uppercase tracking-wider font-semibold">
                  <Shield className="w-3 h-3 text-white/80" />
                  Cohort 2026
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-lg font-bold text-white uppercase tracking-tight">
                  Iron & Kinetic Ring
                </h4>
                <p className="text-[11px] text-[#8C8C8C] leading-relaxed">
                  Capped class density. Zero distractions. Every repetition is coached with biomechanical precision.
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/80">
                <span className="flex items-center gap-1 font-mono text-[#8C8C8C]">
                  <Trophy className="w-3 h-3 text-white/60" /> 15,000 SQ FT HQ
                </span>
                <Link
                  to="/about"
                  className="flex items-center gap-1 text-white hover:underline uppercase tracking-wider font-semibold"
                >
                  Our Ethos <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Discreet Sound Button */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (videoRef.current) videoRef.current.muted = nextMute;
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-wider uppercase text-white/70 hover:text-white bg-black/60 backdrop-blur-md rounded-full border border-white/15 transition-all hover:bg-black/90 self-start lg:self-end"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-white" />}
              <span>{isMuted ? "Sound Muted" : "Sound Active"}</span>
            </button>

          </div>

        </div>

        {/* Bottom Prompter Strip (Clean & slim so it never collides or clips) */}
        <div className="relative z-10 px-6 py-3 flex items-center justify-between text-[11px] tracking-widest uppercase text-[#8C8C8C] border-t border-white/10 bg-black/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <ArrowDown className="w-3.5 h-3.5 text-white animate-bounce" />
            <span className="font-semibold text-white/90">Scroll to explore facility and disciplines</span>
          </div>
          <span className="hidden sm:inline font-mono text-white/50">RAW EFFORT · REFINED DISCIPLINE</span>
        </div>

      </div>
    </section>
  );
}
