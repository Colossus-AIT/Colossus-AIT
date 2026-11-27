import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import heroContent from '@/content/hero.json';

const { titleText, subtitleText } = heroContent;

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const textX = useTransform(x, [0, 1], [10, -10]);
  const textY = useTransform(y, [0, 1], [10, -10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const xPos = (e.clientX - rect.left) / rect.width;
        const yPos = (e.clientY - rect.top) / rect.height;
        mouseX.set(xPos);
        mouseY.set(yPos);
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const letterVariants = {
    initial: { opacity: 0, y: 100, filter: 'blur(10px)' },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        delay: i * 0.05 + 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-[80svh] flex flex-col justify-center items-center overflow-hidden px-6 scroll-mt-24"
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }} />
      </div>

      {/* Main Title */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="relative z-10 text-center "
      >
        {/* Overline */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="block text-xs md:text-sm tracking-[0.3em] text-muted-foreground/60 mb-8 font-body"
        >
            {heroContent.year}
        </motion.span>

       {/* Main Title Letters */}
        <h1 className="font-display text-[11vw] sm:text-[12vw] md:text-[12vw] leading-[0.85] tracking-tighter font-bold">
          <div className="overflow-hidden">
            {titleText.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                initial="initial"
                animate="animate"
                variants={letterVariants}
                className="inline-block hover:font-extrabold transition-all duration-200"
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <div className="overflow-hidden text-[6vw] md:text-[4.5vw] tracking-tighter">
            {subtitleText.split('').map((letter, i) => (
              <motion.span
                key={i}
                custom={i + titleText.length}
                initial="initial"
                animate="animate"
                variants={letterVariants}
                className={`inline-block text-muted-foreground hover:text-foreground transition-all duration-200 ${letter === ' ' ? 'mx-6' : ''}`}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-12 text-sm md:text-base text-muted-foreground max-w-md mx-auto font-body font-light tracking-wide"
        >
         {heroContent.tagline}
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest text-muted-foreground ">{heroContent.scrollLabel}</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground to-transparent" />
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute top-1/4 right-[10%] w-32 h-32 border border-foreground rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-1/3 left-[5%] w-48 h-48 border border-foreground"
      />
    </section>
  );
};

export default HeroSection;
