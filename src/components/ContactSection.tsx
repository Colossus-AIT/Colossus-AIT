import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Github, Instagram, Linkedin } from 'lucide-react';
import contactContent from '@/content/contact.json';

const { socials } = contactContent;

const socialIcons: Record<string, typeof Instagram> = {
  Instagram,
  LinkedIn: Linkedin,
  GitHub: Github,
};

const ContactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      id="contact"
className="flex items-center justify-center py-16 px-6 md:px-12 relative overflow-hidden scroll-mt-24"
    >
      {/* Subtle Background Animation */}
      <div className="absolute inset-0 opacity-[0.02]">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="text-xs tracking-[0.3em] text-muted-foreground font-body">
            {contactContent.sectionLabel}
          </span>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight mb-8">
            {contactContent.headingFirstLine}
            <br />
            {contactContent.headingSecondLine}{' '}
            <span className="italic font-light">{contactContent.headingEmphasis}</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-md">
           {contactContent.description}
          </p>
        </motion.div>

        {/* Email Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <a
            href={`mailto:${contactContent.email}`}
            className="group inline-flex items-center gap-4"
          >
            <span className="font-display text-xl md:text-3xl tracking-tight transition-all duration-300 group-hover:font-bold editorial-link">
              {contactContent.email}
            </span>
            <motion.div
              whileHover={{ x: 5, y: -5 }}
              className="p-3 border border-border rounded-full transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground/5"
            >
              <ArrowUpRight size={20}strokeWidth={1.5} className="transition-all duration-300 group-hover:stroke-[2]" />
            </motion.div>
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4"
        >
          {socials.map((social, index) => {
            const SocialIcon = socialIcons[social.name] || ArrowUpRight;

            return (
              <motion.a
                key={social.name}
                href={social.href}
                aria-label={`Colossus Tech Club on ${social.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="group flex items-center justify-center w-12 h-12 rounded-full border border-border transition-all duration-300 hover:border-foreground"
              >
                <SocialIcon
                  size={20}
                  strokeWidth={1.5}
                  className="transition-all duration-300 group-hover:stroke-[2]"
                />
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
