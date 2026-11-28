import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import aboutContent from '@/content/about.json';
import site from '@/content/site.json';
import { Link } from 'react-router-dom';

const { mainLines, philosophyLines } = aboutContent;

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const HoverLetter = ({ letter, delay }: { letter: string; delay: number }) => {
    if (letter === ' ') return <span>&nbsp;</span>;
    
    return (
      <motion.span
        className="inline-block transition-all duration-200 hover:font-bold cursor-default"
        whileHover={{ scale: 1.1 }}
      >
        {letter}
      </motion.span>
    );
  };

  return (
    <section
      ref={containerRef}
      id="about"
      className="min-h-screen flex items-center justify-center py-10 px-6 md:px-12 scroll-mt-24"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="sr-only">About Colossus Tech Club</h2>
          <span aria-hidden="true" className="text-xs tracking-[0.3em] text-muted-foreground font-body">
            {aboutContent.sectionLabel}
          </span>
        </motion.div>

        {/* Main Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-1"
        >
          {mainLines.map((line, lineIndex) => (
            <motion.div
              key={lineIndex}
              variants={lineVariants}
              className="text-3xl md:text-5xl lg:text-6xl font-display tracking-tight leading-[1.1]"
            >
              {line.split('').map((letter, letterIndex) => (
                <HoverLetter
                  key={letterIndex}
                  letter={letter}
                  delay={lineIndex * 0.1 + letterIndex * 0.01}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Philosophy Lines - visually separated */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-1 mt-12"
        >
          {philosophyLines.map((line, lineIndex) => (
            <motion.div
              key={lineIndex}
              variants={lineVariants}
              className="text-2xl md:text-4xl lg:text-5xl font-display tracking-tight leading-[1.1] text-muted-foreground"
            >
              {line.split('').map((letter, letterIndex) => (
                <HoverLetter
                  key={letterIndex}
                  letter={letter}
                  delay={(lineIndex + mainLines.length) * 0.1 + letterIndex * 0.01}
                />
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="space-y-2">
            <span className="text-xs tracking-widest text-muted-foreground">{aboutContent.focusLabel}</span>
            <p className="text-sm font-body">{aboutContent.focusText}</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs tracking-widest text-muted-foreground">{aboutContent.locationLabel}</span>
            <p className="text-sm font-body">{aboutContent.locationText}</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs tracking-widest text-muted-foreground">{aboutContent.statusLabel}</span>
            <p className="text-sm font-body flex items-center gap-2">
              <span className="w-2 h-2 bg-foreground rounded-full animate-pulse-subtle" />
                  {aboutContent.statusText}
            </p>
          </div>
        </motion.div>
        <div className="mt-10 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>{site.summary} <a href={site.departmentUrl} className="underline underline-offset-4">Visit the AIT department website</a>.</p>
          <p>{site.activities}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link to="/events" className="underline underline-offset-4">Explore technical events</Link></li>
            <li><Link to="/projects" className="underline underline-offset-4">Browse department projects</Link></li>
            <li><a href="#contact" className="underline underline-offset-4">Contact Colossus Tech Club</a></li>
          </ul>
        </div>
        <div className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Questions about Colossus</h3>
          <details className="border-t border-border py-3">
            <summary className="cursor-pointer text-foreground">Has Colossus organised a hackathon?</summary>
            <p className="mt-2">Yes. The club organised Mock Hackathon 2026, where student teams developed solutions to practical challenges. The <Link to="/events" className="underline underline-offset-4">Events page</Link> includes the recap and report.</p>
          </details>
          <details className="border-t border-border py-3">
            <summary className="cursor-pointer text-foreground">How can students take part?</summary>
            <p className="mt-2">Check the Events page for announced activities or <a href="#contact" className="underline underline-offset-4">contact the club</a> to ask about participation.</p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
