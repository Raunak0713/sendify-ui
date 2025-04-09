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
    toast.success("Project Created Successfully");
  };

  return (
    <div className="bg-black min-h-screen p-8 text-white/80 flex flex-col items-center">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-extrabold text-gray-200/90 mb-8 md:mb-0">
          Your Projects
        </h1>
        <Button variant="outline" onClick={() => setOpen(true)} className="flex items-center gap-2  transition-all">
          <Plus size={18} /> Create Project
        </Button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full bg-zinc-800 rounded-xl" />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/dashboard/projects/${project._id}`}
              className="block bg-zinc-900  p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[101%]"
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

      <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent className="dark text-white bg-zinc-900  shadow-xl border-none">
          <DialogHeader>
            <DialogTitle>Create a New Project</DialogTitle>
          </DialogHeader>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-0 focus:border-zinc-700 focus:border focus-visible:outline-none focus-visible:ring-0"
          />

          <DialogFooter>
            <Button  onClick={handleCreateProject} className="border p-2 border-gray-100/20 transition-all">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
