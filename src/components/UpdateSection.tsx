"use client";
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion, useInView } from "framer-motion";

/* Fallback */
const FALLBACK =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="220"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234a5568" font-size="18">Image</text></svg>';

const DEFAULT_IMAGES = [
  //maximum 7 updates
  "/images/posters/ComingSoon.jpg",
  "/images/posters/inaug01.jpg",
  "/images/posters/vishwanathswamyguest-02.png",
  "/images/posters/GUESTREVEAL-01.png",
  "/images/posters/ComingSoon.jpg",
  "/images/posters/ComingSoon.jpg",
  "/images/posters/ComingSoon.jpg",
];

/* Card Component */
interface CardProps {
  src: string;
  transform: string;
  cardW: number;
  cardH: number;
}

const Card = React.memo(({ src, transform, cardW, cardH }: CardProps) => (
  <div
    className="absolute"
    style={{
      width: cardW,
      height: cardH,
      transform,
      transformStyle: "preserve-3d",
      willChange: "transform",
    }}
  >
    <div
      className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ backfaceVisibility: "hidden" }}
    >
      <img
        src={src}
        alt="Carousel item"
        className="w-full h-full object-cover"
        loading="lazy"
        draggable="false"
        onError={(e) => {
          e.currentTarget.src = FALLBACK;
        }}
      />
    </div>
  </div>
));

Card.displayName = "Card";

/* Main Component */
const ThreeDCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Responsive Physics */
  const CARD_W = isMobile ? 160 : 260;
  const CARD_H = isMobile ? 210 : 340;
  const RADIUS = isMobile ? 180 : 360;

  const DRAG_SENSITIVITY = isMobile ? 0.9 : 0.5;
  const AUTOSPIN_SPEED = isMobile ? 0.15 : 0.05;
  const INERTIA_FRICTION = 0.95;
  const IDLE_TIMEOUT = 300;

  /* Motion State */
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const initialRotationRef = useRef(0);
  const lastInteractionRef = useRef(Date.now());
  const animationFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);

  /* Animation Loop */
  useEffect(() => {
    const animate = () => {
      if (!isDraggingRef.current && !isHoveredRef.current) {
        if (Math.abs(velocityRef.current) > 0.01) {
          rotationRef.current += velocityRef.current;
          velocityRef.current *= INERTIA_FRICTION;
        } else if (Date.now() - lastInteractionRef.current > IDLE_TIMEOUT) {
          rotationRef.current += AUTOSPIN_SPEED;
        }
      }

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [AUTOSPIN_SPEED]);

  /* Drag Logic */
  const handleDragStart = useCallback((clientX: number) => {
    isDraggingRef.current = true;
    velocityRef.current = 0;
    dragStartRef.current = clientX;
    initialRotationRef.current = rotationRef.current;
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDraggingRef.current) return;
      const deltaX = clientX - dragStartRef.current;
      const newRotation =
        initialRotationRef.current + deltaX * DRAG_SENSITIVITY;
      velocityRef.current = newRotation - rotationRef.current;
      rotationRef.current = newRotation;
    },
    [DRAG_SENSITIVITY],
  );

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) =>
    handleDragMove(e.touches[0].clientX);

  /* Cards */
  const cards = useMemo(
    () =>
      DEFAULT_IMAGES.map((src, idx) => {
        const angle = (idx * 360) / DEFAULT_IMAGES.length;
        return {
          key: idx,
          src,
          transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
        };
      }),
    [RADIUS],
  );

  return (
    <section
      ref={containerRef}
      id="updates"
      className="px-6 md:px-12 lg:px-24 py-6 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <span className="text-xs tracking-[0.3em] text-muted-foreground">
          002 / IN ACTION
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-12 tracking-tight"
      >
        Updates
      </motion.h2>

      <div
        ref={parentRef}
        className="w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ userSelect: "none" }}
        onMouseEnter={() => (isHoveredRef.current = true)}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          handleDragEnd();
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleDragEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="relative"
          style={{
            perspective: 2000,
            width: RADIUS * 2,
            height: CARD_H * 1.4,
          }}
        >
          <div
            ref={wheelRef}
            className="relative"
            style={{
              width: CARD_W,
              height: CARD_H,
              transformStyle: "preserve-3d",
              position: "absolute",
              left: "50%",
              top: "50%",
              marginLeft: -CARD_W / 2,
              marginTop: -CARD_H / 2,
            }}
          >
            {cards.map((card) => (
              <Card
                key={card.key}
                src={card.src}
                transform={card.transform}
                cardW={CARD_W}
                cardH={CARD_H}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCarousel;
