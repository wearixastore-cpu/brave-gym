import React, { useState, useEffect } from "react";
import { Play, Eye, X } from "lucide-react";

export default function Gallery() {
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMedia(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const galleryItems = [
    {
      type: "video",
      src: "/media/boxing-hero.mp4",
      poster: "/media/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg",
      title: "Kinetic Striking Session",
      category: "Boxing Ring",
      desc: "Authentic 8-second cinematic boxing sparring footage."
    },
    {
      type: "image",
      src: "/media/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg",
      title: "Championship Ring Edge",
      category: "Facility",
      desc: "Competition regulation ring with high-tension ropes."
    },
    {
      type: "image",
      src: "/media/mohamed-fareed-rbSNsoXk-3A-unsplash.jpg",
      title: "Barbell Arena & Iron Zone",
      category: "Strength",
      desc: "Calibrated competition bumper plates and precision bars."
    },
    {
      type: "image",
      src: "/media/hermes-rivera-qbf59TU077Q-unsplash.jpg",
      title: "Metabolic Combine Zone",
      category: "Conditioning",
      desc: "Rowers, ski-ergs, assault runners, and ballistic turf."
    },
    {
      type: "image",
      src: "/media/chris-kendall-sJ6az6-T1u8-unsplash.jpg",
      title: "Coaching Faculty in Action",
      category: "Faculty",
      desc: "Individual biomechanical review and focus pad drills."
    },
    {
      type: "image",
      src: "/media/david-guliciuc-o2zrjlM5s5o-unsplash.jpg",
      title: "Recovery Suite & Restoration",
      category: "Recovery",
      desc: "Contrast plunge baths, infrared saunas, and mobility decks."
    }
  ];

  return (
    <div className="pt-28 pb-32 bg-[#0D0D0D] min-h-screen px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-xs uppercase tracking-widest text-[#8C8C8C] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Visual Documentation
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-extrabold text-white tracking-tight uppercase leading-none">
            THE ARENA.<br />
            <span className="text-[#8C8C8C]">UNFILTERED EFFORT.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed">
            A high-contrast look inside our 15,000 sq ft facility. Every texture and surface is crafted for athletic durability and psychological focus.
          </p>
        </div>

        {/* Gallery Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveMedia(item)}
              className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-[#141414] border border-white/10 cursor-pointer"
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                />
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded w-max border border-white/10">
                  {item.category}
                </span>

                <div>
                  <h3 className="font-display text-xl font-bold text-white uppercase">{item.title}</h3>
                  <p className="text-xs text-[#8C8C8C] mt-1">{item.desc}</p>
                </div>
              </div>

              {item.type === "video" && (
                <div className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg">
                  <Play className="w-3 h-3 fill-black" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {activeMedia && (
          <div
            onClick={() => setActiveMedia(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md overflow-y-auto cursor-zoom-out"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full my-auto bg-[#141414] border border-white/20 rounded-sm overflow-hidden p-6 sm:p-8 space-y-4 shadow-2xl cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media Player / Image Container with HD Black & White Styling */}
              <div className="relative aspect-[16/10] max-h-[70vh] w-full overflow-hidden rounded-sm bg-black border border-white/10">
                {activeMedia.type === "video" ? (
                  <video
                    src={activeMedia.src}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover grayscale contrast-125 filter brightness-90"
                  />
                ) : (
                  <img
                    src={activeMedia.src}
                    alt={activeMedia.title}
                    className="w-full h-full object-contain grayscale contrast-125 filter brightness-95"
                  />
                )}
              </div>

              {/* Media Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8C8C] block mb-1">
                    [ARCHIVE // {activeMedia.category}]
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                    {activeMedia.title}
                  </h3>
                  <p className="text-xs text-[#8C8C8C] mt-1">{activeMedia.desc}</p>
                </div>

                <div className="text-[11px] font-mono text-white/60 bg-white/5 px-3 py-1.5 rounded border border-white/10 shrink-0 self-start sm:self-auto">
                  HD MONOCHROME 4K
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
