import ProjectsSection from '@/components/ProjectsSection';
import departmentProjects from '@/content/department-projects.json';

const Projects = () => <ProjectsSection content={departmentProjects} pageHeading />;

export default Projects;
