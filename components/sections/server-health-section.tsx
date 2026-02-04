"use client";

import { motion } from "framer-motion";
import { HealthDashboard } from "@/components/health-dashboard";

export function ServerHealthSection() {
  return (
    <section id="server-health" className="min-h-screen py-24 px-4 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Server Health
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Real-time monitoring of the hamster wheel that powers this site.
            Updates every 5 minutes because watching paint dry is too exciting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HealthDashboard />
        </motion.div>
      </div>
    </section>
  );
}
