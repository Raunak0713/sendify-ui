"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import { toast } from "sonner";

const ProjectPage = () => {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter()
  const { project, members } = useQuery(api.project.getProjectById, { projectId: projectId as Id<"projects"> }) || {};

  const [showApiKey, setShowApiKey] = useState(false);
  const [projectName, setProjectName] = useState(project?.name);

  const [testNotification, setTestNotification] = useState({
    content: "",
    buttonText: "",
    buttonUrl: "",
  });

  const handleMemberDelete = async (id : Id<"members">) => {
    await fetchMutation(api.member.deleteMember, { id : id })
    toast.success("User Deleted Successfully")
  }

  const handleProjectNameChange = async (id : Id<"projects">, name : string) => {
    await fetchMutation(api.project.changeProjectName, {id : id, name : name})
    toast.success("Project name changed successfully")
  }
  
  const handleProjectDelete = async (id : Id<"projects">) => {
    await fetchMutation(api.project.deleteProject, { id : id })
    toast.success("Project deleted successfully")
    router.push("/dashboard/projects")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTestNotification({ ...testNotification, [e.target.name]: e.target.value });
  };

  if (!project) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-zinc-900 to-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-white/90">{project.name}</h1>

      {/* API Key Section */}
      <div className="flex items-center gap-4 mb-8">
        <label className="text-white/70">API KEY:</label>
        <Input
          type={showApiKey ? "text" : "password"}
          value={project.APIKEY}
          readOnly
          className="w-80 bg-zinc-800 border border-zinc-700 text-white/90"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowApiKey(!showApiKey)}
          className="text-zinc-400 hover:bg-transparent hover:text-zinc-300"
        >
          {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="bg-zinc-800 border border-zinc-700">
          <TabsTrigger value="members" className="text-white/80 data-[state=active]:bg-zinc-700/50 data-[state=active]:text-white">
            Members
          </TabsTrigger>
          <TabsTrigger value="general" className="text-white/80 data-[state=active]:bg-zinc-700/50 data-[state=active]:text-white">
            General
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Table className="mt-4 border-collapse border border-zinc-700 rounded-lg overflow-hidden w-full">
            <TableHeader className="bg-zinc-700/30">
              <TableRow className="border-b border-zinc-700 hover:bg-transparent">
                <TableHead className="text-white/80 px-4 py-3 text-left w-12">#</TableHead>
                <TableHead className="text-white/80 px-4 py-3 flex-1">User ID</TableHead>
                <TableHead className="text-white/80 px-4 py-3 flex-1">Sendify User ID</TableHead>
                <TableHead className="text-white/80 px-4 py-3 flex-1">Send Notification</TableHead>
                <TableHead className="text-white/80 px-4 py-3 text-right w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member, index) => (
                <TableRow key={member._id} className="border-b border-zinc-800 hover:bg-transparent">
                  <TableCell className="text-white/70 px-4 py-3 text-left w-12">{index + 1}</TableCell>
                  <TableCell className="text-white/70 px-4 py-3 flex-1">{member.developerUserId}</TableCell>
                  <TableCell className="text-white/70 px-4 py-3 flex-1">{member._id}</TableCell>
                  
                  {/* Send Test Notification Popover */}
                  <TableCell className="text-white/70 px-4 py-3 flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button>Send Test Notification</Button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-zinc-900 text-white p-4 w-80 rounded-lg shadow-lg border-none">
                        <h3 className="text-lg font-semibold mb-2">Test Notification</h3>
                        <Textarea
                          name="content"
                          placeholder="Enter notification content"
                          value={testNotification.content}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-800 border border-zinc-700 text-white/90 mb-2"
                        />
                        <Input
                          name="buttonText"
                          placeholder="Button Text (Optional)"
                          value={testNotification.buttonText}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-800 border border-zinc-700 text-white/90 mb-2"
                        />
                        <Input
                          name="buttonUrl"
                          placeholder="Button URL (Optional)"
                          value={testNotification.buttonUrl}
                          onChange={handleInputChange}
                          className="w-full bg-zinc-800 border border-zinc-700 text-white/90 mb-4"
                        />
                        <Button className="w-full" variant={"destructive"}>Create Notification</Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>

                  {/* Delete Button */}
                  <TableCell className="text-right px-4 py-3 w-16">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:bg-red-500/10 hover:text-red-400 px-3 py-2 rounded-md transition-all" 
                      onClick={() => handleMemberDelete(member._id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general">
          <div className="mt-4 space-y-4">
            {/* Change Project Name */}
            <div className="flex items-center gap-4">
              <label className="text-white/70 w-48">Change Project Name:</label>
              <Input
                placeholder="Enter new name"
                defaultValue={projectName}
                className="w-96 bg-zinc-800 border border-zinc-700 text-white/90"
                onChange={(e) => setProjectName(e.target.value)}
              />
              <Button className="bg-zinc-800 hover:bg-zinc-700 text-white/90" onClick={() => handleProjectNameChange(projectId as Id<"projects">, projectName!)}>Save</Button>
            </div>

            {/* Delete Project */}
            <div className="flex items-center gap-4">
              <label className="text-white/70 w-48">Delete Project:</label>
              <Button variant="destructive" onClick={() => handleProjectDelete(projectId as Id<"projects">)}>Delete</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
