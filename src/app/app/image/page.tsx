import type { Metadata } from "next";
import { AgentRunner } from "@/components/AgentRunner";
import { TASKS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "AI Image Generation",
};

export default function ImageAgentPage() {
  return (
    <AgentRunner
      task="image"
      title={TASKS.image.title}
      agents={[...TASKS.image.agents]}
      placeholder="Example: Hero product photo for handmade ceramic dessert plates, soft morning light"
    />
  );
}
