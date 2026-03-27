// import { motion, useInView } from "framer-motion";
// import { useRef } from "react";

// const coreSkills = [
//   "JavaScript",
//   "React",
//   "Python",
//   "Tailwind CSS",
//   "HTML",
//   "CSS",
//   "SQL",
// ];

// const secondarySkills = [
//   "GSAP",
//   "Firebase",
//   "GitHub",
//   "Replit",
//   "Lovable",
//   "Figma",
// ];

// const SkillsSection = () => {
//   const sectionRef = useRef<HTMLElement>(null);
//   const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.05,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const skillVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.4,
//         ease: "easeOut" as const,
//       },
//     },
//   };

//   return (
//     <section
//       ref={sectionRef}
//       id="skills"
//       className="min-h-[60vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-16 scroll-mt-24"
//     >
//       {/* Section Label */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={isInView ? { opacity: 1, x: 0 } : {}}
//         transition={{ duration: 0.6 }}
//         className="mb-16"
//       >
//         <span className="text-xs tracking-[0.3em] text-muted-foreground font-body uppercase">
//           002 / Skills
//         </span>
//       </motion.div>

//       {/* Section Title */}
//       <motion.h2
//         initial={{ opacity: 0, y: 20 }}
//         animate={isInView ? { opacity: 1, y: 0 } : {}}
//         transition={{ duration: 0.6, delay: 0.1 }}
//         className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-12 tracking-tight"
//       >
//         Tech Stack
//       </motion.h2>

//       {/* Core Skills */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate={isInView ? "visible" : "hidden"}
//         className="flex flex-wrap gap-4 mb-4"
//       >
//         {coreSkills.map((skill) => (
//           <motion.div
//             key={skill}
//             variants={skillVariants}
//             className="px-6 py-3 border border-foreground/50 rounded-full font-body text-sm md:text-base tracking-wide cursor-default transition-all duration-300 ease-out hover:scale-105 hover:border-foreground hover:bg-foreground/5"
//           >
//             {skill}
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Secondary Skills */}
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate={isInView ? "visible" : "hidden"}
//         className="flex flex-wrap gap-3"
//       >
//         {secondarySkills.map((skill) => (
//           <motion.div
//             key={skill}
//             variants={skillVariants}
//             className="px-5 py-2 border border-muted-foreground/20 rounded-full font-body text-xs md:text-sm tracking-wide cursor-default transition-all duration-300 ease-out hover:scale-105 hover:border-muted-foreground/50 text-muted-foreground"
//           >
//             {skill}
//           </motion.div>
//         ))}
//       </motion.div>
//     </section>
//   );
// };

// export default SkillsSection;
