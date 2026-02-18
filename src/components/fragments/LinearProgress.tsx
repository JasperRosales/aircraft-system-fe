interface LinearProgressProps {
  percent: number;
  width?: number;
  height?: number;
}

export function LinearProgress({ percent, width = 100, height = 8 }: LinearProgressProps) {
  const getColor = (p: number) => {
    if (p >= 80) return "#dc2626";
    if (p >= 50) return "#ca8a04";
    return "#16a34a";
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className="bg-gray-200 rounded-full overflow-hidden"
        style={{ width, height }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            backgroundColor: getColor(percent),
          }}
        />
      </div>
      <span className="text-xs font-medium text-slate-700 min-w-[36px]">
        {percent.toFixed(0)}%
      </span>
    </div>
  );
}

