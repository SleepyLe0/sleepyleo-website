import { Metadata } from "next";
import { HealthDashboard } from "@/components/health-dashboard";

export const metadata: Metadata = {
  title: "Server Health",
  description: "Real-time monitoring of server resources. Because who doesn't love watching numbers change?",
};

export default function ServerHealthPage() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Server Health
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Real-time monitoring of the hamster wheel that powers this site.
            Updates every 5 seconds because watching paint dry is too exciting.
          </p>
        </div>

        <HealthDashboard />
      </div>
    </div>
  );
}
