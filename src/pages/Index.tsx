import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import GallerySection from '@/components/GallerySection';
import QuotesSection from '@/components/QuotesSection';
import ContactSection from '@/components/ContactSection';
import ScrollProgress from '@/components/ScrollProgress';
import FilmGrain from '@/components/FilmGrain';
import ThreeDCarousel from '@/components/UpdateSection';

const Index = () => {
  return (
    <div className="relative">
      <FilmGrain />
      <ScrollProgress />

      <div>
        <HeroSection />
        <AboutSection />
        <ThreeDCarousel />
        <ProjectsSection />
        {/* <SkillsSection /> */}
        <GallerySection />
        <QuotesSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
