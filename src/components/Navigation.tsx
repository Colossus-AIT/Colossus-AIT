import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PillNav from './PillNav';
import navigationContent from '@/content/navigation.json';

const { navItems } = navigationContent;

interface NavigationProps {
  onThemeToggle: (button: HTMLButtonElement) => void;
  isDark: boolean;
}

const Navigation = ({ onThemeToggle, isDark }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center transition-all duration-500 ${
  scrolled ? 'bg-background/80 backdrop-blur-md' : ''
}`}

    
    >
<div className="w-full flex items-center justify-between">
        <motion.a
            href="/#hero"
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={navigationContent.darkLogo}
              alt={navigationContent.logoAlt}
              className={`h-8 w-auto object-contain ${isDark ? '' : 'hidden'}`}
            />
            <img
              src={navigationContent.logo}
              alt={navigationContent.logoAlt}
              className={`h-8 w-auto object-contain ${isDark ? 'hidden' : ''}`}
            />
          </motion.a>

         {/* Pill Navigation */}
      <PillNav
        logo={navigationContent.logo}
        logoAlt={navigationContent.logoAlt}
        items={navItems}
        activeHref={location.pathname.startsWith('/events/') ? '/events' : location.pathname}
        baseColor="transparent"             // keep base fixed
        pillColor="transparent"             // keep pill background fixed
        pillTextColor={isDark ? '#ffffff' : '#000000'}
        hoveredPillTextColor={isDark ? '#ffffff' : '#000000'}
        initialLoadAnimation={false}
      />
 

      {/* Right Controls */}
      <div className="flex items-center gap-6">

        {/* Theme Toggle */}
        <motion.button
          onClick={event => onThemeToggle(event.currentTarget)}
          className="relative p-2 transition-all duration-300 hover:opacity-60"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
        </motion.button>
      </div>
    </div>
    </motion.nav>
  );
};

export default Navigation;
