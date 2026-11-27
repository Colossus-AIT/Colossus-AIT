import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ExternalLink, Download } from 'lucide-react';
import eventsContent from '@/content/events.json';
import mockHackathon from '@/content/mock-hackathon-2026.json';

type EventItem = (typeof eventsContent.events)[number];

const events: EventItem[] = [
  ...eventsContent.events,
  {
    id: mockHackathon.id,
    status: mockHackathon.status,
    title: mockHackathon.title,
    category: mockHackathon.category,
    date: mockHackathon.date,
    poster: `${mockHackathon.imageFolder}/${mockHackathon.photos[0].file}`,
    description: mockHackathon.listingDescription,
    details: mockHackathon.description,
    registrationUrl: '',
    galleryUrl: mockHackathon.reportUrl,
  },
];

const eventGroups = Object.entries(eventsContent.sections).map(([status, section]) => ({
  status,
  ...section,
  events: events.filter(event => event.status === status),
}));

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

    {/* Section Title */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
      >
        {eventsContent.heading}
      </motion.h2>
    </motion.div>

    {eventGroups.map(group => (
      <section key={group.status} aria-labelledby={`events-${group.status}`} className="mb-12 last:mb-0">
        <h3 id={`events-${group.status}`} className="mb-6 font-display text-2xl font-bold tracking-tight md:text-3xl">
          {group.heading}
        </h3>
        {group.events.length === 0 && (
          <p className="text-sm text-muted-foreground">{group.emptyMessage}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {group.events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredId(event.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedEvent(event)}
              className="group relative cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={`relative aspect-[4/5] border bg-card overflow-hidden transition-all duration-500 ${
                  hoveredId === event.id
                    ? 'border-foreground shadow-[0_0_25px_rgba(255,255,255,0.08)]'
                    : 'border-border'
                }`}
              >
                {/* Card Layout */}
                <div className="absolute inset-0 flex flex-col">

                  {/* Poster Section */}
                  <div className="relative w-full aspect-[2/3] overflow-hidden">
                    <img
                      src={event.poster}
                      alt={event.title}
                  className="absolute inset-0 w-full h-full object-contain bg-black transition-transform duration-700 group-hover:scale-105"
                      draggable="false"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 flex flex-col justify-between">

                    {/* Top Meta */}
                    <div className="flex justify-between items-start">
                      <span className="text-xs tracking-widest text-muted-foreground">
                        {event.date}
                      </span>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: hoveredId === event.id ? 1 : 0,
                          scale: hoveredId === event.id ? 1 : 0.5
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowUpRight size={20} />
                      </motion.div>
                    </div>

                    {/* Bottom Info */}
                    <div>
                      <span className="text-xs tracking-widest text-muted-foreground block mb-2">
                        {event.category}
                      </span>

                      <h4
                        className={`font-display text-xl md:text-2xl tracking-tight transition-all duration-300 ${
                          hoveredId === event.id ? 'font-bold' : 'font-medium'
                        }`}
                      >
                        <button
                          type="button"
                          aria-haspopup="dialog"
                          className="text-left after:absolute after:inset-0 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-4px]"
                        >
                          {event.title}
                        </button>
                      </h4>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: hoveredId === event.id ? 1 : 0,
                          y: hoveredId === event.id ? 0 : 10
                        }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-sm text-muted-foreground font-body"
                      >
                        {event.description}
                      </motion.p>
                    </div>

                  </div>
                </div>

                {/* Hover Border */}
                <motion.div
                  className="absolute inset-0 border-2 border-foreground pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === event.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    ))}

    {/* Modal */}
    <AnimatePresence>
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-dialog-title"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.4 }}
            className="relative max-w-2xl w-full bg-card border border-border p-6 sm:p-10 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close event details"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 hover:opacity-60 transition-opacity"
            >
              <X size={24} strokeWidth={1} />
            </button>

            <span className="text-xs tracking-widest text-muted-foreground block mb-3">
              {selectedEvent.category} · {selectedEvent.date}
            </span>

            <h2 id="event-dialog-title" className="font-display text-2xl sm:text-3xl md:text-5xl tracking-tight font-bold mb-6 break-words">
              {selectedEvent.title}
            </h2>

            <p className="text-foreground/80 font-body leading-relaxed mb-10">
              {selectedEvent.details}
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {selectedEvent.registrationUrl && selectedEvent.registrationUrl !== "#" && <a
                href={selectedEvent.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm tracking-widest font-body hover:opacity-70 transition-opacity"
              >
                <ExternalLink size={16} />
                {eventsContent.registrationLabel}
              </a>}

              {selectedEvent.galleryUrl && selectedEvent.galleryUrl !== "#" && <a
                href={selectedEvent.galleryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm tracking-widest font-body hover:opacity-70 transition-opacity"
              >
                <ExternalLink size={16} />
                {eventsContent.viewReportLabel}
              </a>}

              {selectedEvent.galleryUrl && selectedEvent.galleryUrl !== "#" && <a
                href={selectedEvent.galleryUrl}
                download
                className="flex items-center gap-2 text-sm tracking-widest font-body hover:opacity-70 transition-opacity"
              >
                <Download size={16} />
                {eventsContent.detailsLabel}
              </a>}
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
