import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Download, X, Github, ExternalLink, type LucideIcon } from 'lucide-react';
import projectsContent from '@/content/projects.json';
import site from '@/content/site.json';
import { imageProps } from '@/lib/media';

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  details: string;
  liveUrl?: string;
  githubUrl?: string;
  reportUrl?: string;
  image: string;
}

interface ProjectsSectionProps {
  content?: {
    projects: Project[];
    sectionLabel: string;
    heading: string;
  };
  pageHeading?: boolean;
}

interface ProjectActionProps {
  url?: string;
  label: string;
  icon: LucideIcon;
  download?: boolean;
}

const ProjectAction = ({ url, label, icon: Icon, download = false }: ProjectActionProps) => {
  const href = url?.trim();
  const className = 'flex items-center gap-2 text-sm tracking-widest';
  const contents = <><Icon size={16} aria-hidden="true" />{label}</>;

  if (!href || href.startsWith('#')) {
    return <button type="button" disabled className={`${className} cursor-not-allowed opacity-40`}>{contents}</button>;
  }

  return (
    <a
      href={href}
      download={download}
      target={download ? undefined : '_blank'}
      rel={download ? undefined : 'noopener noreferrer'}
      className={`${className} hover:opacity-70`}
    >
      {contents}
    </a>
  );
};

const ProjectsSection = ({ content = projectsContent, pageHeading = false }: ProjectsSectionProps) => {
  const { projects, sectionLabel, heading } = content;
  const Heading = pageHeading ? motion.h1 : motion.h2;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="min-h-screen py-16 px-6 md:px-12 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="text-xs tracking-[0.3em] text-muted-foreground font-body">
            {sectionLabel}
          </span>
        </motion.div>

        <Heading
          initial={pageHeading ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${pageHeading ? 'mb-4' : 'mb-12'}`}
        >
          {heading}
        </Heading>
        {pageHeading && (
          <p className="mb-12 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Project showcase for the {site.department} at {site.institution}, {site.city}.
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedProject(project)}
              className="group relative cursor-pointer"
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={`relative aspect-[4/5] border bg-card overflow-hidden transition-all duration-500 ${
                  hoveredId === project.id
                    ? "border-foreground shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                    : "border-border"
                }`}
              >
                <div className="absolute inset-0 flex flex-col">

                  {/* Image */}
                  <div className="relative w-full aspect-[2/3] overflow-hidden bg-black">
                    <img
                      {...imageProps(project.image, '(max-width: 767px) 90vw, (max-width: 1023px) 45vw, 400px')}
                      alt={project.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs tracking-widest text-muted-foreground">
                        {project.year}
                      </span>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: hoveredId === project.id ? 1 : 0,
                          scale: hoveredId === project.id ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowUpRight size={20} />
                      </motion.div>
                    </div>

                    <div>
                      <span className="text-xs tracking-widest text-muted-foreground block mb-2">
                        {project.category}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl tracking-tight">
                        <button type="button" aria-haspopup="dialog" className="text-left after:absolute after:inset-0 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2">
                          {project.title}
                        </button>
                      </h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: hoveredId === project.id ? 1 : 0,
                          y: hoveredId === project.id ? 0 : 10,
                        }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-sm text-muted-foreground"
                      >
                        {project.description}
                      </motion.p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute inset-0 border-2 border-foreground pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === project.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ duration: 0.4 }}
                className="relative max-w-2xl w-full bg-card border border-border p-6 sm:p-10 md:p-12"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Close project details"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 hover:opacity-60"
                >
                  <X size={24} />
                </button>

                <span className="text-xs tracking-widest text-muted-foreground block mb-2">
                  {selectedProject.category} · {selectedProject.year}
                </span>

                <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-6 break-words">
                  {selectedProject.title}
                </h2>

                <p className="text-foreground/80 leading-relaxed mb-8">
                  {selectedProject.details}
                </p>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  <ProjectAction url={selectedProject.liveUrl} label={projectsContent.liveLabel} icon={ExternalLink} />
                  <ProjectAction url={selectedProject.githubUrl} label={projectsContent.githubLabel} icon={Github} />
                  <ProjectAction url={selectedProject.reportUrl} label={projectsContent.reportLabel} icon={Download} download />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default ProjectsSection;
