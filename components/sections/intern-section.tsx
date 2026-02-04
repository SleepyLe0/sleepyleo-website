"use client";

import { motion } from "framer-motion";
import { ChatUI } from "@/components/chat-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MessageSquare, FolderSearch, Settings, Sparkles } from "lucide-react";

const examples = [
  {
    icon: FolderSearch,
    title: "File Operations",
    description: "\"Show me all files in this folder\" or \"Find all .tsx files\"",
  },
  {
    icon: Settings,
    title: "System Info",
    description: "\"What's my computer name?\" or \"Show system info\"",
  },
  {
    icon: MessageSquare,
    title: "Development",
    description: "\"Check my Node version\" or \"List running processes\"",
  },
  {
    icon: Sparkles,
    title: "Just Chat",
    description: "\"Hello!\" or ask questions about what I can do",
  },
];

export function InternSection() {
  return (
    <section id="intern" className="min-h-screen py-24 px-4 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Leo&apos;s AI Intern
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Meet my AI-powered intern! Just tell it what you need in plain English
            and it&apos;ll figure out the right commands to run. Powered by Gemini Flash 2.5.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <ChatUI />
          </div>

          <div className="space-y-4">
            <Card className="bg-yellow-900/30 border-yellow-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-400 flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4" />
                  Safety Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-yellow-200/80 text-sm">
                  This is for local development only. The AI is instructed to avoid
                  dangerous commands, but please review what it&apos;s doing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-base">Try Asking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {examples.map((example, index) => {
                  const Icon = example.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{example.title}</p>
                        <p className="text-xs text-neutral-400">{example.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-indigo-900/30 border-indigo-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-indigo-400 flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4" />
                  Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-indigo-200/80 text-sm">
                  The AI remembers your conversation context! You can say things like
                  &ldquo;now show me only the TypeScript files&rdquo; after listing a directory.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
