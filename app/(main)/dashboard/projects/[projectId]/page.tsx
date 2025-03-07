"use client"

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../../components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../../components/ui/dialog";
import { Eye, Trash2, Copy, Rocket } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

const ProjectPage = () => {
  const params = useParams()
  const projectId = params.projectId as Id<"projects">;
  const projectData = useQuery(api.project.getProjectById, { projectId });
  const updateProjectName = useMutation(api.project.changeProjectName);
  const deleteProject = useMutation(api.project.deleteProject);
  const sendNotification = useMutation(api.notification.createNotifications);
  const router = useRouter();
  
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [notificationData, setNotificationData] = useState({
    content: "",
    buttonText: "",
    buttonUrl: ""
  });

  useEffect(() => {
    if (projectData?.project?.name) {
      setNewName(projectData.project.name);
    }
  }, [projectData]);

  const handleUpdateName = async () => {
    await updateProjectName({ id: projectId, name: newName });
    toast.success("Project name updated successfully");
  };

  const handleDeleteProject = async () => {
    await deleteProject({ id: projectId });
    toast.success("Project deleted successfully");
    router.push("/dashboard/projects");
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(projectData.project.APIKEY);
    toast.success("API Key copied to clipboard");
  };

  const handleSendNotification = async (developerUserId) => {
    await sendNotification({
      members: [developerUserId],
      content: notificationData.content,
      buttonText: notificationData.buttonText,
      buttonUrl: notificationData.buttonUrl,
      projectId
    });
    toast.success("Notification sent successfully");
    setOpenPopover(null);
  };

  if (!projectData) return <div>Loading...</div>;

  return (
    <div className="bg-black min-h-screen p-6 text-white/70 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">{projectData.project.name}</h1>

      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-6 flex-wrap sm:flex-nowrap">
          <label className="text-sm whitespace-nowrap">API KEY</label>
          <div className="relative flex-1 max-w-md flex items-center gap-2">
            <Input 
              value={apiKeyVisible ? projectData.project.APIKEY : "••••••••••••••••••••••••••"} 
              readOnly 
              className="pr-10 w-full"
            />
            <Eye
              className="cursor-pointer text-white/50"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
            />
            <Copy 
              className="cursor-pointer text-white/50" 
              onClick={handleCopyApiKey} 
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full max-w-4xl">
        <TabsList className="flex justify-start mb-4">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="flex-1">User ID</TableHead>
                <TableHead className="flex-1">Sendify ID</TableHead>
                <TableHead className="flex-1">Send Notification</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectData.members.map((member, index) => (
                <TableRow key={member._id}>
                  <TableCell className="w-12">{index + 1}</TableCell>
                  <TableCell className="flex-1">{member.developerUserId}</TableCell>
                  <TableCell className="flex-1">{member.developerUserId}</TableCell>
                  <TableCell className="flex-1">
                    <Button size="sm" variant="destructive" onClick={() => setOpenPopover(member._id)}>
                      Test <Rocket size={16} className="hidden sm:inline" />
                    </Button>
                  </TableCell>
                  <TableCell className="w-24 text-right">
                    <Button variant="destructive" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this project?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectPage;
