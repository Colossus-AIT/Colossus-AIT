import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { imageProps } from '@/lib/media';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import galleryContent from '@/content/gallery.json';
import mockHackathon from '@/content/mock-hackathon-2026.json';

const galleryItems = [
  ...mockHackathon.photos.map(({ file, caption }) => ({
    image: `${mockHackathon.imageFolder}/${file}`,
    text: caption,
  })),
  ...galleryContent.galleryItems,
];

const CoverFlow = lazy(() => import('@/components/ui/cover-flow'));
const covers = galleryItems.map(({ image, text }) => ({
  ...imageProps(image, '(max-width: 639px) 70vw, 450px'),
  title: text,
}));

const galleryPreview = (
  <img
    {...imageProps(galleryItems[0].image, '(max-width: 639px) 70vw, 450px')}
    alt={galleryItems[0].text}
    loading="lazy"
    className="mx-auto h-full w-auto max-w-full rounded-xl object-contain"
  />
);

const viewerArrowClass = 'flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground hover:border-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

const GallerySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const coverFlowContainer = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const loadCoverFlow = useInView(coverFlowContainer, { once: true, margin: '250px' });
  const reduceMotion = useReducedMotion();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const selectedPhoto = galleryItems[selectedIndex];

  const centerThumbnail = useCallback((thumbnail: HTMLButtonElement | null) => {
    const strip = thumbnail?.closest<HTMLDivElement>('[data-gallery-thumbnails]');
    if (!thumbnail || !strip) return;

    const stripBounds = strip.getBoundingClientRect();
    const thumbnailBounds = thumbnail.getBoundingClientRect();
    strip.scrollLeft += thumbnailBounds.left + thumbnailBounds.width / 2
      - (stripBounds.left + strip.clientWidth / 2);
  }, []);

  const movePhoto = (direction: number) => {
    setSelectedIndex(index => (index + direction + galleryItems.length) % galleryItems.length);
  };

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

      <div ref={coverFlowContainer} className="mx-auto h-[340px] max-w-7xl sm:h-[460px] lg:h-[520px]">
        {loadCoverFlow ? <Suspense fallback={galleryPreview}><CoverFlow
          items={covers}
          defaultIndex={0}
          ariaLabel="Gallery cover flow"
          stageColor="hsl(var(--background))"
          showBackdrop={false}
          pageColor="transparent"
          accent="hsl(var(--ring))"
          captionColor="#fff"
          font="var(--font-display)"
          wheel={false}
          sway={0}
          onSelect={index => {
            setSelectedIndex(index);
            setIsViewerOpen(true);
          }}
          style={{ minHeight: 0 }}
        /></Suspense> : galleryPreview}
      </div>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-h-[94dvh] w-[calc(100%-1rem)] max-w-[calc(68dvh+10rem)] gap-3 overflow-auto p-3 motion-reduce:animate-none sm:w-[calc(100%-2rem)] sm:gap-4 sm:p-6"
          onCloseAutoFocus={event => {
            event.preventDefault();
            coverFlowContainer.current?.querySelector<HTMLElement>('[aria-roledescription="carousel"]')?.focus({ preventScroll: true });
          }}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              movePhoto(event.key === 'ArrowLeft' ? -1 : 1);
            }
          }}
        >
          <DialogTitle aria-live="polite" className="pr-8 text-base">
            {selectedPhoto.text}
          </DialogTitle>
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4">
            <div className="relative col-span-3 col-start-1 row-start-1 h-[min(68dvh,135vw)] overflow-hidden rounded-xl border border-border bg-card sm:col-span-1 sm:col-start-2 sm:aspect-square sm:h-auto sm:max-h-[68dvh]">
              <div className="absolute inset-0 bottom-14 overflow-hidden">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={selectedPhoto.image}
                    src={selectedPhoto.image}
                    alt={selectedPhoto.text}
                    className="absolute inset-0 h-full w-full bg-card object-contain"
                    initial={reduceMotion ? false : { clipPath: 'circle(0% at 50% 50%)' }}
                    animate={{ clipPath: 'circle(75% at 50% 50%)', zIndex: 1 }}
                    exit={{ zIndex: 0, opacity: 0.99 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.42,
                      ease: 'easeInOut',
                      zIndex: { duration: 0 },
                    }}
                  />
                </AnimatePresence>
              </div>
              <div data-gallery-thumbnails role="group" aria-label="Gallery thumbnails" className="absolute inset-x-0 bottom-0 z-10 overflow-x-auto scrollbar-hide bg-background/90">
                <div className="mx-auto flex w-max items-center gap-1.5 px-2 py-2 sm:gap-2">
                  {galleryItems.map((item, index) => (
                    <button
                      key={item.image}
                      ref={index === selectedIndex ? centerThumbnail : undefined}
                      type="button"
                      aria-label={`Photo ${index + 1}: ${item.text}`}
                      aria-current={index === selectedIndex ? 'true' : undefined}
                      onClick={() => setSelectedIndex(index)}
                      className={`size-10 shrink-0 overflow-hidden rounded-full border-2 bg-muted p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        index === selectedIndex ? 'border-foreground' : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <img {...imageProps(item.image)} alt="" loading="lazy" className="h-full w-full rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button type="button" aria-label="Previous photo" onClick={() => movePhoto(-1)} className={`${viewerArrowClass} col-start-1 row-start-2 justify-self-start sm:row-start-1`}>
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <p className="col-start-2 row-start-2 text-center text-sm tabular-nums text-muted-foreground sm:col-span-3 sm:col-start-1">{selectedIndex + 1} / {galleryItems.length}</p>
            <button type="button" aria-label="Next photo" onClick={() => movePhoto(1)} className={`${viewerArrowClass} col-start-3 row-start-2 justify-self-end sm:row-start-1`}>
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
