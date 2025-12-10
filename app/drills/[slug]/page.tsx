import { DrillDetailBody } from "@/components/pages/DrillDetailBody";

export default function DynamicSprintLadderPage() {
  return (
    <DrillDetailBody
      backHref="/drills"
      title="Dynamic Sprint Ladder"
      description={
        "Boost your acceleration and coordination with this dynamic sprint ladder. " +
        "Set up five spaced markers, then progress each step sequentially to improve " +
        "speed technique, agility, and overall sprint mechanics."
      }
      steps={[
        { title: "Set up markers" },
        { title: "High-knee sprints" },
        { title: "Lateral shuffles" },
        { title: "Backpedal return" },
        { title: "Full-speed sprint" },
        { title: "Rest and repeat" },
      ]}
    />
  );
}
