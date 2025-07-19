import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const projectStages = [
  "Land Acquired",
  "Contract Signed",
  "Slab",
  "Frame",
  "Lock-up",
  "Fixing",
  "PCI",
  "C of O",
  "Final Claim",
  "Sale/Archive"
];

const initialProjects = [
  {
    name: "56 Inge King Crescent",
    stage: 7,
    loanApproved: 1167200,
    drawn: 1100000,
    cashSpent: 1380000,
    outstanding: 70000,
    entity: "Lush Whitlam Homes 01 Pty Ltd"
  },
  {
    name: "Block 15 Section 87, Whitlam",
    stage: 2,
    loanApproved: 0,
    drawn: 0,
    cashSpent: 100000,
    outstanding: 1480000,
    entity: "Lush Whitlam Homes 02 Pty Ltd"
  }
];

const stageProgress = (stage: number) => (stage / (projectStages.length - 1)) * 100;

const LushDashboard = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [newProject, setNewProject] = useState({
    name: "",
    stage: 0,
    loanApproved: 0,
    drawn: 0,
    cashSpent: 0,
    outstanding: 0,
    entity: ""
  });

  const markStageComplete = (index: number) => {
    setProjects((prev) => {
      const updated = [...prev];
      if (updated[index].stage < projectStages.length - 1) {
        updated[index].stage += 1;
      }
      return updated;
    });
  };

  const addNewProject = () => {
    setProjects((prev) => [...prev, newProject]);
    setNewProject({
      name: "",
      stage: 0,
      loanApproved: 0,
      drawn: 0,
      cashSpent: 0,
      outstanding: 0,
      entity: ""
    });
  };

  return (
    <div className="p-4 grid gap-6">
      {projects.map((project, idx) => (
        <Card key={idx} className="shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-1">{project.name}</h2>
            <p className="text-xs italic mb-2">Entity: {project.entity}</p>
            <p className="mb-2 text-sm">Current Stage: {projectStages[project.stage]}</p>
            <Progress value={stageProgress(project.stage)} className="mb-4" />
            <div className="text-sm text-muted-foreground mb-2">
              <p>Loan Approved: ${project.loanApproved.toLocaleString()}</p>
              <p>Drawn: ${project.drawn.toLocaleString()}</p>
              <p>Cash Spent: ${project.cashSpent.toLocaleString()}</p>
              <p>Outstanding: ${project.outstanding.toLocaleString()}</p>
            </div>
            <Button onClick={() => markStageComplete(idx)}>Mark Stage Complete</Button>
          </CardContent>
        </Card>
      ))}

      <Card className="shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Add New Project</h2>
          <Input
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <Input
            placeholder="Entity (Company Name)"
            value={newProject.entity}
            onChange={(e) => setNewProject({ ...newProject, entity: e.target.value })}
          />
          <Select onValueChange={(val) => setNewProject({ ...newProject, stage: parseInt(val) })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Stage" />
            </SelectTrigger>
            <SelectContent>
              {projectStages.map((stage, i) => (
                <SelectItem key={i} value={i.toString()}>{stage}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Loan Approved"
            value={newProject.loanApproved || ""}
            onChange={(e) => setNewProject({ ...newProject, loanApproved: parseFloat(e.target.value) || 0 })}
          />
          <Input
            type="number"
            placeholder="Drawn"
            value={newProject.drawn || ""}
            onChange={(e) => setNewProject({ ...newProject, drawn: parseFloat(e.target.value) || 0 })}
          />
          <Input
            type="number"
            placeholder="Cash Spent"
            value={newProject.cashSpent || ""}
            onChange={(e) => setNewProject({ ...newProject, cashSpent: parseFloat(e.target.value) || 0 })}
          />
          <Input
            type="number"
            placeholder="Outstanding"
            value={newProject.outstanding || ""}
            onChange={(e) => setNewProject({ ...newProject, outstanding: parseFloat(e.target.value) || 0 })}
          />
          <Button onClick={addNewProject}>Add Project</Button>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Project Stage Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={projects.map((project) => ({
                name: project.name,
                stage: project.stage,
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, projectStages.length - 1]}
                ticks={[...Array(projectStages.length).keys()]}
                tickFormatter={(v) => projectStages[v]}
              />
              <Tooltip formatter={(val) => projectStages[val as number]} />
              <Bar dataKey="stage" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default LushDashboard;