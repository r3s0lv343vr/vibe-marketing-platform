import type { Metadata } from "next";
import { AgentRunner } from "@/components/AgentRunner";
import { TASKS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "Employer & Market Pulse",
};

export default function MarketAgentPage() {
  return (
    <AgentRunner
      task="market"
      title={TASKS.market.title}
      agents={[...TASKS.market.agents]}
      placeholder="Example: What should I emphasize about my AI marketing / SaaS project to employers this month?"
    />
  );
}
