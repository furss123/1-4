import { IconPadlet } from "@/components/icons";
import { PADLET_BOARD } from "@/lib/constants";

export function PadletFloatingLink() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center">
      <div className="relative h-0 w-full max-w-app">
        <a
          href={PADLET_BOARD.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${PADLET_BOARD.label} 바로가기`}
          title={PADLET_BOARD.label}
          className="pointer-events-auto absolute top-[calc(50vh-1.5rem)] right-3 flex h-12 w-12 items-center justify-center rounded-lg bg-card shadow-card ring-1 ring-border/70 transition-transform hover:scale-105 active:scale-95"
        >
          <IconPadlet className="h-7 w-7" />
        </a>
      </div>
    </div>
  );
}
