import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import StatsCards from "@/components/stats-cards";
import ProjectsTable from "@/components/projects-table";
import ProjectModal from "@/components/project-modal";
import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Project Dashboard</h2>
              <p className="text-slate-600 mt-1">Manage and track your projects</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleNewProject}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="text-slate-600">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <StatsCards />

        {/* Projects Table */}
        <ProjectsTable 
          projects={projects} 
          isLoading={isLoading}
          onEditProject={handleEditProject}
        />
      </main>

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={editingProject}
      />
    </div>
  );
}
