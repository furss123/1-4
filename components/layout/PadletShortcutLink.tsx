import { IconPadlet, IconShortcutArrow } from "@/components/icons";
import { PADLET_BOARD } from "@/lib/constants";

type PadletShortcutLinkProps = {
  className?: string;
};

export function PadletShortcutLink({ className = "" }: PadletShortcutLinkProps) {
  return (
    <a
      href={PADLET_BOARD.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${PADLET_BOARD.label} 바로가기`}
      title={PADLET_BOARD.label}
      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card shadow-card ring-1 ring-border/80 transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      <IconPadlet className="h-8 w-8" />
      <span
        className="absolute -right-1 -bottom-1 flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-[5px] bg-school text-white shadow-sm ring-2 ring-card"
        aria-hidden
      >
        <IconShortcutArrow className="h-2.5 w-2.5" />
      </span>
    </a>
  );
}
