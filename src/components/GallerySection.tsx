import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

interface GalleryItem {
  id: number;
  text: string;
  image: string;
}

const galleryItems: GalleryItem[] = [
  { id: 1, text: "Session 1", image: "/images/gallery/session-01 img-03.jpeg" },
  { id: 2, text: "Butterfly", image: "/images/gallery/img2.jpg" },
  { id: 3, text: "chrysanthemum", image: "/images/gallery/img3.jpg" },
  { id: 4, text: "Wall Art", image: "/images/gallery/img4.jpg" },
  { id: 5, text: "Lily", image: "/images/gallery/img18.jpg" },
  { id: 6, text: "Yellow Peony", image: "/images/gallery/img6.jpg" },
  { id: 7, text: "Guest!", image: "/images/gallery/img7.jpg" },
  { id: 8, text: "Reward", image: "/images/gallery/img8.jpg" },
  { id: 9, text: "Wall Art", image: "/images/gallery/img9.jpg" },
  { id: 10, text: "Guest!", image: "/images/gallery/img10.jpg" },
  { id: 11, text: "Waterlily", image: "/images/gallery/img11.jpg" },
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
        Math.max(0, Math.min(newIndex + 1, galleryItems.length - 1)),
      );
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
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

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section ref={containerRef} id="gallery" className="py-10 px-6 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.3em] text-muted-foreground font-body">
            004 / MOMENTS
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl tracking-tight mt-8"
        >
          Gallery
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground font-body mt-4 text-sm mb-8"
        >
          Scroll horizontally to explore →
        </motion.p>
      </div>

      {/* Gallery */}
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-8 px-6 md:px-12 cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: "smooth" }}
      >
        {galleryItems.map((item, index) => (
          <div key={item.id} className="flex-shrink-0 p-4">
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
                  activeIndex === index ? "border-foreground" : "border-border"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.text}
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
                ? "bg-foreground w-6"
                : "bg-muted-foreground/30 w-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default GallerySection;
