import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2, 
  Paperclip,
  Building,
  Home,
  Warehouse
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onEditProject: (project: Project) => void;
}

export default function ProjectsTable({ projects, isLoading, onEditProject }: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.entityId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'planning':
        return 'bg-amber-100 text-amber-800';
      case 'construction':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getProjectIcon = (name: string) => {
    if (name.toLowerCase().includes('tower')) return Building;
    if (name.toLowerCase().includes('apartment') || name.toLowerCase().includes('home')) return Home;
    if (name.toLowerCase().includes('industrial') || name.toLowerCase().includes('complex')) return Warehouse;
    return Building;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      deleteMutation.mutate(project.id);
    }
  };

  if (isLoading) {
    return (
      <section className="px-6 pb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-slate-600 mt-2">Loading projects...</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="px-6 pb-6">
      <Card>
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent Projects</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Loan Approved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Drawn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cash Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Files
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="text-slate-500">
                      {searchTerm ? "No projects found matching your search." : "No projects yet. Create your first project to get started."}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => {
                  const ProjectIcon = getProjectIcon(project.name);
                  return (
                    <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ProjectIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{project.name}</div>
                            <div className="text-sm text-slate-500">{project.entityId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStageColor(project.stage)}>
                          {project.stage}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatCurrency(project.loanApproved)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatCurrency(project.drawn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatCurrency(project.cashSpent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatCurrency(project.outstanding)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600">{project.files.length}</span>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditProject(project)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(project)}
                            className="text-red-400 hover:text-red-600"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredProjects.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredProjects.length}</span> of{" "}
                <span className="font-medium">{projects.length}</span> results
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
