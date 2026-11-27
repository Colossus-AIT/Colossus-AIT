import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import quotesContent from '@/content/quotes.json';

const { quotes } = quotesContent;

const QuotesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const quoteVariants = {
    initial: {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      filter: 'blur(10px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      id="quotes"
className="flex flex-col items-center pt-16 pb-16 px-6 md:px-12"
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <span className="text-xs tracking-[0.3em] text-muted-foreground font-body">
            {quotesContent.sectionLabel}
          </span>
        </motion.div>

        {/* Quote Container */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center"
            >
              <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-8">
                "{quotes[currentIndex].text}"
              </blockquote>
              <cite className="text-sm tracking-widest text-muted-foreground font-body not-italic">
                {quotes[currentIndex].author}
              </cite>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-3 mt-16"
        >
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? 'bg-foreground w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default QuotesSection;
