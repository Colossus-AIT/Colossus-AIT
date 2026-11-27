import { ArrowLeft, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import event from '@/content/mock-hackathon-2026.json';

const MockHackathon = () => (
  <article id="hero" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-20 pt-8 md:px-12 md:pb-28 md:pt-12">
    <Link
      to="/events"
      className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      {event.backLabel}
    </Link>

    <header className="border-b border-border pb-12 pt-10 md:pb-16 md:pt-14">
      <p className="mb-5 text-xs uppercase tracking-widest text-muted-foreground">
        {event.category} · {event.date}
      </p>
      <h1 className="max-w-5xl text-4xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-8xl">
        {event.title}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-xl">
        {event.description}
      </p>
      <p className="mt-6 text-sm">Organized by {event.organizer}</p>
    </header>

    <section aria-labelledby="hackathon-overview" className="grid gap-4 border-b border-border py-10 md:grid-cols-[1fr_2fr] md:gap-10 md:py-14">
      <h2 id="hackathon-overview" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {event.overviewHeading}
      </h2>
      <p className="max-w-2xl leading-relaxed text-muted-foreground">{event.overview}</p>
    </section>

    <section aria-labelledby="hackathon-highlights" className="border-b border-border py-10 md:py-14">
      <h2 id="hackathon-highlights" className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        {event.highlightsHeading}
      </h2>
      <ul className="grid gap-x-10 gap-y-6 md:grid-cols-3">
        {event.highlights.map(({ title, description }) => (
          <li key={title} className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>
    </section>

    <section aria-labelledby="hackathon-gallery" className="pt-10 md:pt-14">
      <h2 id="hackathon-gallery" className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        {event.galleryHeading}
      </h2>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {event.photos.map(({ file, caption }) => {
          const image = `${event.imageFolder}/${file}`;

          return (
            <li key={file}>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Enlarge image: ${caption}`}
                    className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden border border-border bg-muted group-hover:border-foreground">
                      <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
                      <span className="absolute bottom-3 right-3 border border-border bg-background p-2 text-foreground">
                        <Maximize2 size={16} aria-hidden="true" />
                      </span>
                    </span>
                    <span className="mt-2 block text-sm text-muted-foreground group-hover:text-foreground">{caption}</span>
                  </button>
                </DialogTrigger>
                <DialogContent
                  aria-describedby={undefined}
                  className="max-h-[92dvh] w-[calc(100%-2rem)] max-w-5xl grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-auto p-4 motion-reduce:animate-none sm:p-6"
                >
                  <DialogTitle className="pr-10 font-display text-base">{caption}</DialogTitle>
                  <img src={image} alt={caption} className="max-h-[72dvh] w-full object-contain" />
                </DialogContent>
              </Dialog>
            </li>
          );
        })}
      </ul>
    </section>
  </article>
);

export default MockHackathon;
