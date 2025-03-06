"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

interface Project {
  _id: Id<"projects">;
  name: string;
  APIKEY: string;
}

const ProjectCard = ({ project, router } : { project: Project; router: ReturnType<typeof useRouter> }) => {
  return (
    <Card
      onClick={() => router.push(`/dashboard/projects/${project._id}`)}
      className="w-full max-w-sm bg-transparent border-gray-100/20 text-white cursor-pointer transition"
    >
      <CardHeader>
        <CardTitle className="text-lg">{project.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};

const ProjectsPage = () => {
  const { user } = useUser();
  const router = useRouter(); 
  //@ts-expect-error Will work
  const projects = useQuery(api.project.getAllProjects, { clerkId : user?.id});
  const createProject = useMutation(api.project.createProject);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreateProject = async () => {
    if (!user) return;
    await createProject({ name, clerkId: user.id });
    setOpen(false);
    setName("");
  };

  return (
    <div className="p-5 text-white">
      {/* Create Project Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-5 bg-blue-500 hover:bg-blue-600">Create Project</Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Create a New Project</DialogTitle>
          </DialogHeader>
          <Input
            className="mt-3 bg-zinc-800 border-zinc-700"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button className="mt-3 w-full bg-blue-500 hover:bg-blue-600" onClick={handleCreateProject}>
            Create
          </Button>
        </DialogContent>
      </Dialog>

      {/* Display Projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {projects && projects.length > 0 ? (
          projects.map((project) => <ProjectCard key={project._id} project={project} router={router} />)
        ) : (
          <p className="text-zinc-400">No projects found. Create one!</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
