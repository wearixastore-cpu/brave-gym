import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-28 pb-32 bg-[#0D0D0D] min-h-screen px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#8C8C8C] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Direct Communication
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-extrabold text-white tracking-tight uppercase leading-none">
            ENTER THE ARENA.<br />
            <span className="text-[#8C8C8C]">REACH OUT.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed">
            Have questions about private coaching, team training camps, or booking a private facility walkthrough? Send us a dispatch below.
          </p>
        </div>

        {/* Contact Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#141414] border border-white/10 p-8 sm:p-10 rounded-sm space-y-6">
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              Request Information or Consultation
            </h3>

            {submitted ? (
              <div className="p-6 bg-white/10 border border-white/30 rounded text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-white mx-auto" />
                <h4 className="font-display text-xl font-bold text-white uppercase">Dispatch Received</h4>
                <p className="text-xs text-[#8C8C8C]">
                  Our athletic director will review your message and reply within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="text-xs uppercase font-mono tracking-wider text-white">Full Name</label>
                    <input
                      id="contact-name"
                      name="contactName"
                      autoComplete="name"
                      type="text"
                      required
                      placeholder="e.g. Marcus Cole"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/15 rounded-sm text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-xs uppercase font-mono tracking-wider text-white">Email Address</label>
                    <input
                      id="contact-email"
                      name="contactEmail"
                      autoComplete="email"
                      type="email"
                      required
                      placeholder="e.g. marcus@discipline.com"
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/15 rounded-sm text-sm text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-interest" className="text-xs uppercase font-mono tracking-wider text-white">Area of Interest</label>
                  <select
                    id="contact-interest"
                    name="contactInterest"
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/15 rounded-sm text-sm text-white focus:outline-none focus:border-white transition-colors"
                  >
                    <option>Championship Boxing Curriculum</option>
                    <option>Iron Discipline Barbell Strength</option>
                    <option>Metabolic Warfare Conditioning</option>
                    <option>Private 1-on-1 Obsidian Coaching</option>
                    <option>Trial Pass & General Facility Inquiries</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-xs uppercase font-mono tracking-wider text-white">Message / Training Goals</label>
                  <textarea
                    id="contact-message"
                    name="contactMessage"
                    rows="4"
                    required
                    placeholder="Briefly state your current physical foundation and goals..."
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/15 rounded-sm text-sm text-white focus:outline-none focus:border-white transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#F5F5F3] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Transmit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Right Facility Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#141414] border border-white/10 p-8 rounded-sm space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8C8C8C]">Facility Headquarters</span>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white shrink-0 mt-1" />
                  <div>
                    <strong className="text-white block font-display text-base">Brave Gym District 04</strong>
                    <span className="text-[#8C8C8C]">844 Athletic Blvd, Industrial Quarter, Metro Area</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white shrink-0" />
                  <span className="text-[#8C8C8C]">+1 (555) 019-2834</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white shrink-0" />
                  <span className="text-[#8C8C8C]">frontdesk@bravegym.com</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-white block flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Training Hours
                </span>
                <div className="text-xs text-[#8C8C8C] space-y-1">
                  <div className="flex justify-between"><span>Monday — Friday:</span> <strong className="text-white">05:30 – 22:00</strong></div>
                  <div className="flex justify-between"><span>Saturday:</span> <strong className="text-white">07:00 – 20:00</strong></div>
                  <div className="flex justify-between"><span>Sunday:</span> <strong className="text-white">08:00 – 16:00 (Open Sparring & Plunge)</strong></div>
                </div>
              </div>
            </div>

            {/* Quick Facility Photo */}
            <div className="aspect-[16/9] rounded-sm overflow-hidden border border-white/10 relative">
              <img
                src="/media/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg"
                alt="Gym Entry"
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-[11px] uppercase font-mono tracking-widest text-white/70">
                Front Entrance & Pro Shop
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
