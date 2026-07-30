import type { Metadata } from "next";
import { AgentRunner } from "@/components/AgentRunner";
import { TASKS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "AI Video Creation",
};

export default function VideoAgentPage() {
  return (
    <AgentRunner
      task="video"
      title={TASKS.video.title}
      agents={[...TASKS.video.agents]}
      placeholder="Example: 15-second Instagram launch clip for a SaaS ops tool"
    />
  );
}
