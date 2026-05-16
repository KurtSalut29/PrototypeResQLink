interface TimelineStep {
  label: string;
  time?: string;
  state: "done" | "active" | "pending";
}

export default function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              step.state === "done" ? "bg-green-500" :
              step.state === "active" ? "bg-[#D32F2F] ring-4 ring-red-100" :
              "bg-gray-200"
            }`}>
              {step.state === "done" && <span className="text-white text-[9px]">✓</span>}
              {step.state === "active" && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-8 ${step.state === "done" ? "bg-green-300" : "bg-gray-200"}`} />
            )}
          </div>
          <div className="pb-4">
            <p className={`text-xs font-semibold ${
              step.state === "active" ? "text-[#D32F2F]" :
              step.state === "done" ? "text-gray-700" : "text-gray-400"
            }`}>{step.label}</p>
            {step.time && <p className="text-[10px] text-gray-400">{step.time}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
