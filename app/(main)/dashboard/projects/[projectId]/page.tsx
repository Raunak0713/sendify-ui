"use client"

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../../components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Eye, Trash2, Copy, Rocket, BookOpen } from "lucide-react";
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
  const [projectIdVisible, setProjectIdVisible] = useState(false);
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

  const handleCopyProjectId = () => {
    navigator.clipboard.writeText(projectData.project._id);
    toast.success("PROJECT ID copied to clipboard")
  }

  const handleSendNotification = async (memberId) => {
    if (!notificationData.content) {
      toast.error("Notification content is required");
      return;
    }

    try {
      await sendNotification({
        members: [memberId], // Pass as array with single member
        projectId,
        content: notificationData.content,
        buttonText: notificationData.buttonText || undefined,
        buttonUrl: notificationData.buttonUrl || undefined
      });
      toast.success("Notification sent successfully");
      setOpenPopover(null);
      setNotificationData({
        content: "",
        buttonText: "",
        buttonUrl: ""
      });
    } catch (error) {
      toast.error("Failed to send notification");
      console.error("Notification error:", error);
    }
  };

  const openDocs = () => {
    window.open("https://docs.sendify.100xbuild.com", "_blank");
  };

  if (!projectData) return <div>Loading...</div>;

  return (
    <div className="bg-black min-h-screen p-6 text-white/70 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{projectData.project.name}</h1>
        <Button 
          className="border border-gray-100/20 flex items-center gap-2" 
          onClick={openDocs}
        >
          <BookOpen size={16} />
          <span className="hidden sm:inline">Documentation</span>
        </Button>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex flex-col gap-4 mb-6 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-12">
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
          <div className="flex items-center gap-5">
            <label className="text-sm whitespace-nowrap">PROJECT ID</label>
            <div className="relative flex-1 max-w-md flex items-center gap-2">
              <Input 
                value={projectIdVisible ? projectData.project._id : "••••••••••••••••••••••••••"} 
                readOnly 
                className="pr-10 w-full"
              />
              <Eye
                className="cursor-pointer text-white/50"
                onClick={() => setProjectIdVisible(!projectIdVisible)}
              />
              <Copy 
                className="cursor-pointer text-white/50" 
                onClick={handleCopyProjectId} 
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full max-w-4xl">
        <TabsList className="flex justify-start mb-4">
          <TabsTrigger className="bg-gray-100/10" value="members">Members</TabsTrigger>
          <TabsTrigger className="bg-gray-100/10" value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="flex-1 text-center">User ID</TableHead>
                <TableHead className="flex-1 text-center">Sendify ID</TableHead>
                <TableHead className="flex-1 text-center">Send Notification</TableHead>
                <TableHead className="w-24 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectData.members && projectData.members.length > 0 ? (
                projectData.members.map((member, index) => (
                  <TableRow key={member._id}>
                    <TableCell className="w-12 text-center">{index + 1}</TableCell>
                    <TableCell className="flex-1 text-center">{member.developerUserId}</TableCell>
                    <TableCell className="flex-1 text-center">{member._id}</TableCell>
                    <TableCell className="flex-1 text-center">
                      <Popover open={openPopover === member._id} onOpenChange={(open) => setOpenPopover(open ? member._id : null)}>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <span className="hidden sm:inline mr-1">Send</span> 
                            <Rocket size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 dark">
                          <div className="space-y-4">
                            <h3 className="font-medium">Send Notification</h3>
                            
                            <div className="space-y-2">
                              <label className="text-sm">Content</label>
                              <Input
                                value={notificationData.content}
                                onChange={(e) => setNotificationData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Notification message"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm">Button Text (Optional)</label>
                              <Input
                                value={notificationData.buttonText}
                                onChange={(e) => setNotificationData(prev => ({ ...prev, buttonText: e.target.value }))}
                                placeholder="View details"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm">Button URL (Optional)</label>
                              <Input
                                value={notificationData.buttonUrl}
                                onChange={(e) => setNotificationData(prev => ({ ...prev, buttonUrl: e.target.value }))}
                                placeholder="https://example.com"
                              />
                            </div>
                            
                            <div className="flex justify-end">
                              <Button size="sm" variant="destructive" onClick={() => handleSendNotification(member.developerUserId)}>
                                Send Notification
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="w-24 text-center">
                      <Button variant="destructive" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="text-white/50 mb-2">No members found in this project</div>
                    <div className="text-sm text-white/30">
                      Check the documentation for how to add members to your project
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="general">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="text-sm block mb-1">Change Project Name</label>
                <Input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-0 focus:border-zinc-700 focus:border focus-visible:outline-none focus-visible:ring-0"
                />
              
              </div>
              <Button className="p-2 border border-gray-100/20" onClick={handleUpdateName}>Save</Button>
            </div>

            <div>
              <Button className="border p-2 border-gray-100/20" onClick={() => setOpenDeleteDialog(true)}>
                Delete Project
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="bg-gray-100/30">
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