import type { Metadata } from "next";
import { AgentRunner } from "@/components/AgentRunner";
import { TASKS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "AI Web Page Creation",
};

export default function WebAgentPage() {
  return (
    <AgentRunner
      task="web"
      title={TASKS.web.title}
      agents={[...TASKS.web.agents]}
      placeholder="Example: Launch landing page for a neighborhood coffee shop with tasting club CTA"
    />
  );
}
