import { motion } from 'framer-motion';
import footerContent from '@/content/footer.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 md:px-12 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <span className="font-display text-sm tracking-widest">
            {footerContent.tagline}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            © {currentYear} {footerContent.copyright}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-8">
          <motion.a
            href="#hero"
            whileHover={{ y: -2 }}
            className="text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            {footerContent.backToTop}
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
