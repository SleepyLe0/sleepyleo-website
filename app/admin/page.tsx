import { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ProjectManager } from "@/components/project-manager";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import { ArrowLeft, Bot, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin - Project Manager",
  description: "Manage your portfolio projects",
};

export default async function AdminPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Project Manager
            </h1>
            <p className="text-neutral-400">
              Import projects from GitHub, manage visibility, and customize details.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            href="/admin/intern"
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-indigo-900/10"
          >
            <div className="mb-4 inline-flex rounded-lg bg-indigo-500/20 p-2 text-indigo-400 group-hover:text-indigo-300">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">AI Intern</h3>
            <p className="text-sm text-neutral-400">
              Use your AI assistant to run commands, check system status, and help with development tasks.
            </p>
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-5 w-5 text-indigo-400" />
            </div>
          </Link>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">Manage Projects</h2>
        <ProjectManager />
      </div>
    </div>
  );
}
