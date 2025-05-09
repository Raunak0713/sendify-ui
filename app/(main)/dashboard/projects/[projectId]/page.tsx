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
import { Eye, Trash2, Copy, Rocket, BookOpen, Key, FileCode, Users, Settings, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

const ProjectPage = () => {
  const params = useParams();
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
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
    if (!newName.trim()) return;
    
    setIsUpdating(true);
    try {
      await updateProjectName({ id: projectId, name: newName });
      toast.success("Project name updated successfully", {
        style: {
          background: "linear-gradient(90deg, #FF4D00, #FFC700)",
          color: "black",
          fontWeight: "600",  // Using the 'font-semibold' equivalent
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(255, 165, 0, 0.3)",
        },
      });
    } catch (error) {
      toast.error("Failed to update project name");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await deleteProject({ id: projectId });
      toast.success("Project deleted successfully", {
        style: {
          background: "linear-gradient(90deg, #FF4D00, #FFC700)",
          color: "black",
          fontWeight: "600",  // Using the 'font-semibold' equivalent
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(255, 165, 0, 0.3)",
        },
      });
      router.push("/dashboard/projects");
    } catch (error) {
      toast.error("Failed to delete project");
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(projectData.project.APIKEY);
    toast.success("API Key copied to clipboard", {
      style: {
        background: "linear-gradient(90deg, #FF4D00, #FFC700)",
        color: "black",
        fontWeight: "600",  // Using the 'font-semibold' equivalent
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(255, 165, 0, 0.3)",
      },
    });
  };

  const handleCopyProjectId = () => {
    navigator.clipboard.writeText(projectData.project._id);
    toast.success("PROJECT ID copied to clipboard", {
      style: {
        background: "linear-gradient(90deg, #FF4D00, #FFC700)",
        color: "black",
        fontWeight: "600",  // Using the 'font-semibold' equivalent
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(255, 165, 0, 0.3)",
      },
    });
  };

  const handleSendNotification = async (memberId) => {
    if (!notificationData.content) {
      toast.error("Notification content is required");
      return;
    }

    setIsSendingNotification(true);
    try {
      await sendNotification({
        members: [memberId],
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
    } finally {
      setIsSendingNotification(false);
    }
  };

  const openDocs = () => {
    window.open("https://docs.sendify.100xbuild.com", "_blank");
  };

  if (!projectData) {
    return (
      <div className="bg-gradient-to-b from-[#0F0F11] to-[#131316] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D00] to-[#FFC700] rounded-full opacity-20 animate-ping"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-[#FF4D00] to-[#FFC700] rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-black animate-spin" />
            </div>
          </div>
          <p className="mt-6 text-[#D0D0D0] font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0F0F11] to-[#131316] min-h-screen p-8 text-[#D0D0D0] font-sans relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#FF4D00]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-[#FFC700]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D00] to-[#FFC700]">
                {projectData.project.name}
              </span>
            </h1>
            <p className="text-[#9A9A9A]">Project settings and management</p>
          </div>
          <Button
            onClick={openDocs}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-5 py-2 rounded-full transition-all border border-white/10"
          >
            <BookOpen size={16} />
            <span>Documentation</span>
          </Button>
        </div>

        {/* Project credentials */}
        <div className="bg-[#1A1A1D]/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/5 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Project Credentials</h2>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 min-w-[120px]">
                <div className="bg-gradient-to-r from-[#FF4D00]/10 to-[#FFC700]/10 p-2 rounded-lg">
                  <Key className="h-5 w-5 text-[#FFA500]" />
                </div>
                <span className="text-white font-medium">API KEY</span>
              </div>
              <div className="relative flex-1 w-full flex items-center">
                <Input 
                  value={apiKeyVisible ? projectData.project.APIKEY : "••••••••••••••••••••••••••"} 
                  readOnly 
                  className="bg-[#0F0F11]/80 border border-white/10 text-white pr-20 rounded-lg"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  <button 
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="p-1.5 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <Eye size={18} className="text-white/50 hover:text-white/80 transition-colors" />
                  </button>
                  <button 
                    onClick={handleCopyApiKey}
                    className="p-1.5 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <Copy size={18} className="text-white/50 hover:text-white/80 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 min-w-[120px]">
                <div className="bg-gradient-to-r from-[#FF4D00]/10 to-[#FFC700]/10 p-2 rounded-lg">
                  <FileCode className="h-5 w-5 text-[#FFA500]" />
                </div>
                <span className="text-white font-medium">PROJECT ID</span>
              </div>
              <div className="relative flex-1 w-full flex items-center">
                <Input 
                  value={projectIdVisible ? projectData.project._id : "••••••••••••••••••••••••••"} 
                  readOnly 
                  className="bg-[#0F0F11]/80 border border-white/10 text-white pr-20 rounded-lg"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  <button 
                    onClick={() => setProjectIdVisible(!projectIdVisible)}
                    className="p-1.5 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <Eye size={18} className="text-white/50 hover:text-white/80 transition-colors" />
                  </button>
                  <button 
                    onClick={handleCopyProjectId}
                    className="p-1.5 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <Copy size={18} className="text-white/50 hover:text-white/80 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-[#1A1A1D]/50 p-1 rounded-xl mb-6 border border-white/5">
            <TabsTrigger 
              value="members" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF4D00]/20 data-[state=active]:to-[#FFC700]/20 data-[state=active]:text-white rounded-lg px-4 py-2.5"
            >
              <Users size={16} />
              Members
            </TabsTrigger>
            <TabsTrigger 
              value="general" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF4D00]/20 data-[state=active]:to-[#FFC700]/20 data-[state=active]:text-white rounded-lg px-4 py-2.5"
            >
              <Settings size={16} />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-[#1A1A1D]/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-[#0F0F11]/50">
                  <TableRow className="border-b border-white/5 hover:bg-transparent">
                    <TableHead className="w-12 text-center font-medium text-white/70">#</TableHead>
                    <TableHead className="text-left font-medium text-white/70">User ID</TableHead>
                    <TableHead className="text-left font-medium text-white/70">Sendify ID</TableHead>
                    <TableHead className="text-center font-medium text-white/70">Notification</TableHead>
                    <TableHead className="w-24 text-center font-medium text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectData.members && projectData.members.length > 0 ? (
                    projectData.members.map((member, index) => (
                      <TableRow key={member._id} className="border-b border-white/5 hover:bg-[#FF4D00]/5">
                        <TableCell className="w-12 text-center font-mono">{index + 1}</TableCell>
                        <TableCell className="font-mono text-sm">{member.developerUserId}</TableCell>
                        <TableCell className="font-mono text-sm">{member._id}</TableCell>
                        <TableCell className="text-center">
                          <Popover open={openPopover === member._id} onOpenChange={(open) => setOpenPopover(open ? member._id : null)}>
                            <PopoverTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-[#FF4D00]/80 to-[#FFC700]/80 text-black font-medium rounded-full px-3 py-1 hover:shadow-orange-400/20 transition-all"
                              >
                                <Rocket size={14} className="mr-1" />
                                Send
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="bg-[#1A1A1D] border border-white/10 rounded-xl shadow-xl p-4 w-80 z-10">
                              <div className="space-y-4">
                                <h3 className="font-bold text-white">Send Notification</h3>
                                
                                <div className="space-y-2">
                                  <label className="text-sm text-white/70 block">Content</label>
                                  <Input
                                    value={notificationData.content}
                                    onChange={(e) => setNotificationData(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="Notification message"
                                    className="bg-[#0F0F11]/80 border border-white/10 text-white rounded-lg"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm text-white/70 block">Button Text (Optional)</label>
                                  <Input
                                    value={notificationData.buttonText}
                                    onChange={(e) => setNotificationData(prev => ({ ...prev, buttonText: e.target.value }))}
                                    placeholder="View details"
                                    className="bg-[#0F0F11]/80 border border-white/10 text-white rounded-lg"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm text-white/70 block">Button URL (Optional)</label>
                                  <Input
                                    value={notificationData.buttonUrl}
                                    onChange={(e) => setNotificationData(prev => ({ ...prev, buttonUrl: e.target.value }))}
                                    placeholder="https://example.com"
                                    className="bg-[#0F0F11]/80 border border-white/10 text-white rounded-lg"
                                  />
                                </div>
                                
                                <div className="flex justify-end">
                                  <Button 
                                    disabled={isSendingNotification}
                                    onClick={() => handleSendNotification(member.developerUserId)}
                                    className="bg-gradient-to-r from-[#FF4D00] to-[#FFC700] text-black font-medium rounded-full px-4 py-2 hover:shadow-orange-400/20 transition-all"
                                  >
                                    {isSendingNotification ? (
                                      <>
                                        <Loader2 size={14} className="mr-2 animate-spin" />
                                        Sending...
                                      </>
                                    ) : (
                                      "Send Notification"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell className="w-24 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full w-8 h-8 p-0"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <div className="bg-gradient-to-r from-[#FF4D00]/10 to-[#FFC700]/10 p-3 rounded-full mb-4">
                            <Users className="h-8 w-8 text-[#FFA500]" />
                          </div>
                          <div className="text-white font-medium mb-2">No members found in this project</div>
                          <div className="text-sm text-white/50 max-w-md text-center">
                            Check the documentation for how to add members to your project
                          </div>
                          <Button
                            onClick={openDocs}
                            className="mt-6 bg-white/5 hover:bg-white/10 text-white font-medium px-5 py-2 rounded-full transition-all border border-white/10"
                          >
                            <BookOpen size={14} className="mr-2" />
                            View Documentation
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="general" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="bg-[#1A1A1D]/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/5 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Project Settings</h3>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm text-white/70 block">Project Name</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        className="bg-[#0F0F11]/80 border border-white/10 text-white rounded-lg flex-1"
                      />
                      <Button 
                        onClick={handleUpdateName}
                        disabled={isUpdating || !newName.trim()}
                        className="bg-gradient-to-r from-[#FF4D00] to-[#FFC700] text-black font-medium rounded-full px-5 py-2 hover:shadow-orange-400/20 transition-all whitespace-nowrap"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 size={14} className="mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-red-500 mb-4">Danger Zone</h3>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-1">Delete Project</h4>
                      <p className="text-sm text-white/50">This action cannot be undone</p>
                    </div>
                    <Button 
                      onClick={() => setOpenDeleteDialog(true)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium rounded-full px-4 py-2 transition-all border border-red-500/20"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete Project
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="bg-[#1A1A1D] border border-white/10 rounded-xl shadow-xl max-w-md">
          <div className="flex flex-col items-center text-center p-4">
            <div className="bg-red-500/20 p-3 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white mb-2">Delete Project</DialogTitle>
            </DialogHeader>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete this project? This action cannot be undone and all associated data will be permanently removed.
            </p>
            <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full">
              <Button 
                onClick={() => setOpenDeleteDialog(false)}
                className="bg-white/5 hover:bg-white/10 text-white font-medium rounded-full px-5 py-2 transition-all border border-white/10 flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteProject}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-full px-5 py-2 transition-all flex-1"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectPage;
