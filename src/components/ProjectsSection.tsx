import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Github, ExternalLink } from 'lucide-react';
import projectsContent from '@/content/projects.json';

const { projects } = projectsContent;

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  details: string;
  liveUrl: string;
  githubUrl: string;
  image: string;
}

const ProjectsSection = () => {
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
            {projectsContent.sectionLabel}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-12 tracking-tight"
        >
          {projectsContent.heading}
        </motion.h2>

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
                      src={project.image}
                      alt={project.title}
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
                        {project.title}
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
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 hover:opacity-60"
                >
                  <X size={24} />
                </button>

                <span className="text-xs tracking-widest text-muted-foreground block mb-2">
                  {selectedProject.category} — {selectedProject.year}
                </span>

                <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-6 break-words">
                  {selectedProject.title}
                </h2>

                <p className="text-foreground/80 leading-relaxed mb-8">
                  {selectedProject.details}
                </p>

                <div className="flex items-center gap-8">
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm tracking-widest hover:opacity-70"
                  >
                    <ExternalLink size={16} />
                    {projectsContent.liveLabel}
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm tracking-widest hover:opacity-70"
                  >
                    <Github size={16} />
                    {projectsContent.githubLabel}
                  </a>
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
