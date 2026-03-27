import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, ExternalLink, Download } from "lucide-react";

interface EventItem {
  id: number;
  title: string;
  category: string;
  date: string;
  poster: string;
  description: string;
  details: string;
  registrationUrl: string;
  galleryUrl: string;
  detailsPdf?: string;
}

const events: EventItem[] = [
  {
    id: 1,
    title: "CLUB INAUGURATION",
    category: "Club Launch",
    date: "25 March 2026",
    poster: "/images/gallery/inaug-11.jpeg",
    description: "Official launch of Colossus Tech Club",
    details:
      "The official inauguration introducing the club vision, core team, roadmap, and upcoming technical initiatives.",
    registrationUrl: "#",
    galleryUrl: "#",
    detailsPdf: "/pdf/inaug-report-pdf.pdf", // ✅ FIXED (no /public)
  },
  // {
  //   id: 2,
  //   title: "FULL STACK WORKSHOP",
  //   category: "Web Development",
  //   date: "April 2026",
  //   poster: "/images/posters/ComingSoon.jpg",
  //   description: "Hands-on real-world dev session",
  //   details:
  //     "A practical full-stack development workshop covering architecture, deployment, Git workflows, and collaborative coding.",
  //   registrationUrl: "#",
  //   galleryUrl: "#",
  // },
  // {
  //   id: 3,
  //   title: "AI INDUSTRY SESSION",
  //   category: "Artificial Intelligence",
  //   date: "May 2026",
  //   poster: "/images/posters/ComingSoon.jpg",
  //   description: "Industry expert technical talk",
  //   details:
  //     "An expert-led session explaining how AI systems are built, deployed, and integrated into production software environments.",
  //   registrationUrl: "#",
  //   galleryUrl: "#",
  // },
];

const EventsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section
      ref={containerRef}
      id="events"
      className="min-h-screen py-10 px-6 md:px-12 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight">
            Events
          </h2>
        </motion.div>

        {/* Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedEvent(event)}
              className="group relative cursor-pointer hover:cursor-zoom-in" // ✅ cursor change
            >
              <motion.div
                whileHover={{ y: -8 }}
                className={`relative aspect-[4/5] border bg-card overflow-hidden transition-all duration-500 ${
                  hoveredId === event.id
                    ? "border-foreground shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                    : "border-border"
                }`}
              >
                <div className="absolute inset-0 flex flex-col">
                  <div className="relative w-full aspect-[2/3] overflow-hidden">
                    <img
                      src={event.poster}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-contain bg-black transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        {event.date}
                      </span>

                      <ArrowUpRight
                        size={20}
                        className={`transition ${
                          hoveredId === event.id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block mb-2">
                        {event.category}
                      </span>

                      <h3 className="text-xl font-medium">{event.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-2xl border border-white/10 bg-black px-10 py-12"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close */}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-6 right-6 text-white/70 hover:text-white transition"
                >
                  <X size={22} />
                </button>

                {/* Top meta */}
                <p className="text-xs tracking-[0.2em] text-white/40 mb-4">
                  {selectedEvent.category} — {selectedEvent.date}
                </p>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight mb-6">
                  {selectedEvent.title}
                </h2>

                {/* Description */}
                <p className="text-white/60 leading-relaxed mb-10 max-w-lg">
                  {selectedEvent.details}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-8 text-sm tracking-widest">
                  {selectedEvent.registrationUrl &&
                    selectedEvent.registrationUrl !== "#" && (
                      <a
                        href={selectedEvent.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/80 hover:text-white transition"
                      >
                        <ExternalLink size={16} />
                        REGISTER
                      </a>
                    )}

                  {selectedEvent.detailsPdf && (
                    <a
                      href={selectedEvent.detailsPdf}
                      target="_blank"
                      download
                      className="flex items-center gap-2 text-white/80 hover:text-white transition"
                    >
                      <Download size={16} />
                      DETAILS PDF
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default EventsSection;
