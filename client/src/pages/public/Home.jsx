import React from "react";
import ScrollVideoHero from "../../components/home/ScrollVideoHero";
import StatsMarquee from "../../components/home/StatsMarquee";
import ProgramsPinned from "../../components/home/ProgramsPinned";
import TrainersRoster from "../../components/home/TrainersRoster";
import MembershipSection from "../../components/home/MembershipSection";
import TestimonialFeature from "../../components/home/TestimonialFeature";
import CallToAction from "../../components/home/CallToAction";

export default function Home() {
  return (
    <div className="w-full bg-[#0D0D0D]">
      {/* 1. Scroll-bound Video Hero (user requested: scroll then play as scroll) */}
      <ScrollVideoHero />

      {/* 2. Horizontal Stats Marquee */}
      <StatsMarquee />

      {/* 3. Sticky 60/40 Asymmetric Programs Reveal */}
      <ProgramsPinned />

      {/* 4. Horizontal Drag/Scroll Trainers Gallery */}
      <TrainersRoster />

      {/* 5. Membership & Commitment Tiers */}
      <MembershipSection />

      {/* 6. Editorial Testimonial Feature */}
      <TestimonialFeature />

      {/* 7. Call To Action Footer Precursor */}
      <CallToAction />
    </div>
  );
}
