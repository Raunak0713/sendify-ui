"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Plus, Folder, Sparkles, Loader2 } from "lucide-react"
import { Skeleton } from "../../../../components/ui/skeleton"
import { toast } from "sonner"

const ProjectsPage = () => {
  const { userId } = useAuth()
  const projects = useQuery(api.project.getAllProjects, {
    clerkId: userId || "",
  })
  const createProject = useMutation(api.project.createProject)

  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleCreateProject = async () => {
    if (!projectName.trim()) return
    setIsCreating(true)
    try {
      await createProject({ clerkId: userId, name: projectName })
      setProjectName("")
      setOpen(false)
      toast.success("Project Created Successfully", {
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
      toast.error("Failed to create project", {
        className: "p-4 rounded-xl shadow-lg",  // Tailwind classes for padding, border-radius, and shadow
        style: {
          backgroundColor: "#1A1A1D",  // Dark background from Sendify theme
          color: "#D0D0D0",  // Light gray text
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",  // Subtle dark shadow for depth
          fontWeight: "500",  // Medium font weight for readability
        },
      });       
    } finally {
      setIsCreating(false)
    }
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
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D00] to-[#FFC700]">
                Projects
              </span>
            </h1>
            <p className="text-[#9A9A9A] text-lg">Manage and organize your creative work</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF4D00] to-[#FFC700] text-black font-semibold px-6 py-6 rounded-full shadow-lg hover:shadow-orange-400/30 transition-all mt-6 md:mt-0 h-12"
          >
            <Plus size={18} /> Create Project
          </Button>
        </div>

        {/* Main content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D00]/10 to-[#FFC700]/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Skeleton className="h-48 w-full bg-[#1A1A1D]/80 rounded-2xl border border-white/5" />
              </div>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {projects.map((project) => (
              <Link key={project._id} href={`/dashboard/projects/${project._id}`} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D00]/20 to-[#FFC700]/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-[#1A1A1D]/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/5 group-hover:border-[#FF4D00]/20 transition-all duration-300 group-hover:translate-y-[-5px] h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-gradient-to-r from-[#FF4D00]/10 to-[#FFC700]/10 p-3 rounded-xl">
                      <Folder className="h-6 w-6 text-[#FFA500]" />
                    </div>
                    <div className="bg-white/5 rounded-full px-3 py-1 text-xs font-medium text-white/70">Project</div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF4D00] group-hover:to-[#FFC700] transition-all duration-300">
                    {project.name}
                  </h2>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-gradient-to-r from-[#FF4D00] to-[#FFC700] rounded-full p-2">
                      <Sparkles className="h-4 w-4 text-black" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-[#1A1A1D]/50 backdrop-blur-sm p-12 rounded-2xl border border-white/5 shadow-xl max-w-md mx-auto mt-40">
            <div className="bg-gradient-to-r from-[#FF4D00]/10 to-[#FFC700]/10 p-4 rounded-full mb-6">
              <Folder className="h-10 w-10 text-[#FFA500]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No projects yet</h2>
            <p className="text-[#9A9A9A] text-center mb-8">Create your first project to start organizing your work</p>
            <Button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#FF4D00] to-[#FFC700] text-black font-semibold px-6 py-6 rounded-full shadow-lg hover:shadow-orange-400/30 transition-all h-12"
            >
              <Plus size={18} className="mr-2" /> Create Your First Project
            </Button>
          </div>
        )}
      </div>

      {/* Create project dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#1A1A1D]/95 backdrop-blur-xl text-white shadow-xl border border-white/10 rounded-2xl max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D00]/5 to-[#FFC700]/5 rounded-2xl blur-md opacity-50 pointer-events-none" />
          <div className="relative">
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#FF4D00]/10 to-[#FFC700]/10 p-3 rounded-xl inline-block mb-2">
                  <Folder className="h-6 w-6 text-[#FFA500]" />
                </div>
                <DialogTitle className="text-2xl font-bold text-white mb-1">Create a New Project</DialogTitle>
              </div>
              <p className="text-[#9A9A9A] mt-2">Give your project a name to get started</p>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="project-name" className="text-sm font-medium text-white/70 block">
                  Project Name
                </label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="bg-[#0F0F11]/80 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#FF4D00]/50 rounded-xl p-4 h-12"
                />
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-white font-medium px-5 py-2 rounded-full transition-all h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={isCreating || !projectName.trim()}
                  className="bg-gradient-to-r from-[#FF4D00] to-[#FFC700] text-black font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-orange-400/30 transition-all h-12 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectsPage
