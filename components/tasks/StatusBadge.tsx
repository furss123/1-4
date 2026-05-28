import { STATUS_STYLES } from "@/lib/constants";
import { normalizeProgressStatus } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  compact?: boolean;
};

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const resolved = normalizeProgressStatus(status);
  const style = STATUS_STYLES[resolved];

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold ${style.bg} ${style.text} ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {style.label}
    </span>
  );
}
