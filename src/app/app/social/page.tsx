import type { Metadata } from "next";
import { AgentRunner } from "@/components/AgentRunner";
import { TASKS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "Social Profile Studio",
};

export default function SocialAgentPage() {
  return (
    <AgentRunner
      task="social"
      title={TASKS.social.title}
      agents={[...TASKS.social.agents]}
      placeholder="Example: I’m shipping a PM platform + comms app; help me upgrade LinkedIn, Instagram, and Facebook for hiring partners"
    />
  );
}
