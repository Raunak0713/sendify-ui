"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Plus } from "lucide-react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { toast } from "sonner";

const ProjectsPage = () => {
  const { userId } = useAuth();
  const projects = useQuery(api.project.getAllProjects, {
    clerkId: userId || "",
  });
  const createProject = useMutation(api.project.createProject);

  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    await createProject({ clerkId: userId, name: projectName });
    setProjectName("");
    setOpen(false);
    toast.success("Project Created Successfully")
  };

  return (
    <div className="bg-black min-h-screen p-6 text-white/80 flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Create Project
        </Button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full bg-zinc-800 rounded-xl" />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/dashboard/projects/${project._id}`}
              className="block bg-black border border-gray-100/20 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300  text-center"
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-lg text-zinc-400">No projects found.</p>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark text-white">
          <DialogHeader>
            <DialogTitle>Create a New Project</DialogTitle>
          </DialogHeader>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
          <DialogFooter>
            <Button variant="destructive" onClick={handleCreateProject}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;