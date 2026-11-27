import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import galleryContent from '@/content/gallery.json';
import mockHackathon from '@/content/mock-hackathon-2026.json';

const galleryItems = [
  ...mockHackathon.photos.map(({ file, caption }) => ({
    image: `${mockHackathon.imageFolder}/${file}`,
    text: caption,
  })),
  ...galleryContent.galleryItems,
];

const GallerySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const itemWidth = 280 + 16;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(
        Math.max(0, Math.min(newIndex + 1, galleryItems.length - 1))
      );
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="py-10 px-6 md:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.3em] text-muted-foreground font-body">
            {galleryContent.sectionLabel}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl tracking-tight mt-8"
        >
            {galleryContent.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground font-body mt-4 text-sm mb-8"
        >
          {galleryContent.instructions}
        </motion.p>
      </div>

      {/* Gallery */}
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-8 px-6 md:px-12 cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth' }}
      >
        {galleryItems.map((item, index) => (
          <div key={item.image} className="flex-shrink-0 p-4">
            <motion.div
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                scale: hoveredIndex === index ? 1.1 : 1,
                opacity:
                  hoveredIndex === null
                    ? 0.6
                    : hoveredIndex === index
                    ? 1
                    : 0.4,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div
                className={`relative w-[280px] h-[380px] bg-card border overflow-hidden transition-all ${
                  activeIndex === index
                    ? 'border-foreground'
                    : 'border-border'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.text}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Text */}
                <div className="absolute bottom-3 left-3">
  <span className="font-mangro text-sm tracking-wide text-foreground">
    {item.text}
  </span>
</div>
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {galleryItems.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-foreground w-6'
                : 'bg-muted-foreground/30 w-2'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
