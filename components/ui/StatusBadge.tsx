type Status = "critical" | "moderate" | "minor" | "resolved" | "in-progress" | "dispatched" | "en-route" | "on-scene";

const styles: Record<Status, string> = {
  critical: "bg-red-100 text-red-700 border border-red-300",
  moderate: "bg-orange-100 text-orange-700 border border-orange-300",
  minor: "bg-green-100 text-green-700 border border-green-300",
  resolved: "bg-gray-100 text-gray-500 border border-gray-300",
  "in-progress": "bg-orange-100 text-orange-700 border border-orange-300",
  dispatched: "bg-blue-100 text-blue-700 border border-blue-300",
  "en-route": "bg-green-100 text-green-700 border border-green-300",
  "on-scene": "bg-green-100 text-green-700 border border-green-300",
};

const labels: Record<Status, string> = {
  critical: "Critical",
  moderate: "Moderate",
  minor: "Minor",
  resolved: "Resolved",
  "in-progress": "In Progress",
  dispatched: "Dispatched",
  "en-route": "En Route",
  "on-scene": "On Scene",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
