import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-white/10 text-[#8C8C8C] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded overflow-hidden flex items-center justify-center p-1 border border-white/20 bg-black shadow-md">
                <img
                  src="/logo.png"
                  alt="Brave Gym"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <span className="font-display font-bold text-2xl tracking-wider text-white uppercase">
                BRAVE <span className="text-[#8C8C8C] font-normal">GYM</span>
              </span>
            </div>
            <h3 className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none">
              SHOW UP.<br />
              <span className="text-[#8C8C8C]">BE BRAVE.</span>
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-[#8C8C8C]">
              Brave Gym is a high-performance training ground dedicated to the relentless pursuit of human potential. Boxing, strength, and metabolic conditioning engineered for disciplined minds and bodies.
            </p>
            <div className="flex items-center gap-4 text-xs tracking-widest text-white uppercase pt-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Facility Open Today: 05:30 — 22:00
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xs uppercase tracking-widest text-white font-semibold">Training</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/programs" className="hover:text-white transition-colors">Championship Boxing</Link></li>
              <li><Link to="/programs" className="hover:text-white transition-colors">Iron Discipline Strength</Link></li>
              <li><Link to="/programs" className="hover:text-white transition-colors">Metabolic Warfare</Link></li>
              <li><Link to="/programs" className="hover:text-white transition-colors">Kinetic Recovery</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Class Timetable</Link></li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xs uppercase tracking-widest text-white font-semibold">Sanctuary</span>
            <ul className="space-y-2 text-sm">
              <li><Link to="/trainers" className="hover:text-white transition-colors">Coaching Roster</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Membership Tiers</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">The Facility & Ring</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Brand Philosophy</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Member Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-xs uppercase tracking-widest text-white font-semibold">HQ Location</span>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-1" />
                <span>844 Athletic Blvd, District 4<br />Downtown Metro</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>concierge@bravegym.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Large Typography Watermark */}
        <div className="pt-12 select-none overflow-hidden">
          <h2 className="font-display font-bold text-[12vw] tracking-tighter text-white/[0.04] leading-none uppercase text-center">
            BRAVE GYM
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs tracking-wider text-[#8C8C8C] gap-4">
          <p>© {new Date().getFullYear()} BRAVE ATHLETIC CLUB INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 uppercase">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#code" className="hover:text-white transition-colors">Member Code of Conduct</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
