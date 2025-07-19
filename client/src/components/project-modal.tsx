import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type Project, type InsertProject } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CloudUpload, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      stage: "",
      loanApproved: 0,
      drawn: 0,
      cashSpent: 0,
      outstanding: 0,
      entityId: "",
      files: [],
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        stage: project.stage,
        loanApproved: project.loanApproved,
        drawn: project.drawn,
        cashSpent: project.cashSpent,
        outstanding: project.outstanding,
        entityId: project.entityId,
        files: project.files,
      });
    } else {
      form.reset({
        name: "",
        stage: "",
        loanApproved: 0,
        drawn: 0,
        cashSpent: 0,
        outstanding: 0,
        entityId: "",
        files: [],
      });
    }
    setFiles([]);
  }, [project, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'files') {
          formData.append(key, value.toString());
        }
      });

      // Append files
      files.forEach(file => {
        formData.append('files', file);
      });

      if (project) {
        return await apiRequest("PUT", `/api/projects/${project.id}`, formData);
      } else {
        return await apiRequest("POST", "/api/projects", formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: project ? "Project updated successfully" : "Project created successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save project",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    mutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity ID</FormLabel>
                    <FormControl>
                      <Input placeholder="ENT-2024-XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loanApproved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Approved</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="drawn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drawn Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cashSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cash Spent</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outstanding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outstanding</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Project Files</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
                <div className="flex flex-col items-center">
                  <CloudUpload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 mb-2">
                    <label htmlFor="file-upload" className="font-medium text-primary cursor-pointer hover:text-primary/80">
                      Click to upload
                    </label>
                    {" "}or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
              
              {/* File preview area */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                      <span className="text-sm text-slate-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : project ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
