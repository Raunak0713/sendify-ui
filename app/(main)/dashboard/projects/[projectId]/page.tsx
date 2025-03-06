// app/(main)/dashboard/projects/[projectId]/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

const ProjectPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const { project, members } = useQuery(api.project.getProjectById, { projectId : projectId as Id<"projects"> }) || {};

  const [showApiKey, setShowApiKey] = useState(false);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-zinc-900 to-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <div className="flex items-center gap-2 mb-8">
        <Input
          type={showApiKey ? "text" : "password"}
          value={project.APIKEY}
          readOnly
          className="w-96 bg-zinc-800 border-zinc-700 text-white"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowApiKey(!showApiKey)}
          className="text-zinc-400 hover:text-white"
        >
          {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="bg-zinc-800 border-zinc-700">
          <TabsTrigger value="members" className="text-white">
            Members
          </TabsTrigger>
          <TabsTrigger value="general" className="text-white">
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Table className="mt-4">
            <TableHeader>
              <TableRow className="hover:bg-zinc-800">
                <TableHead className="text-white">Developer ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member._id} className="hover:bg-zinc-800">
                  <TableCell className="text-white">{member.developerUserId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="general">
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Change project name"
                defaultValue={project.name}
                className="w-96 bg-zinc-800 border-zinc-700 text-white"
              />
              <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">Save</Button>
            </div>
            <Button variant="destructive">Delete Project</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;