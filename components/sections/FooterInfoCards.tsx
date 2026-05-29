import type { ReactNode } from "react";
import { IconPadlet, IconQuestion } from "@/components/icons";
import { INQUIRY_CONTACT, PADLET_BOARD } from "@/lib/constants";

function FooterLinkCard({
  href,
  title,
  description,
  icon,
  iconClassName,
  external,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconClassName: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      className="flex items-center gap-3 rounded-card bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-bold text-school">{title}</span>
        <p className="mt-0.5 text-xs font-medium leading-relaxed text-ink-muted">{description}</p>
      </div>
      {external ? (
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
          ↗
        </span>
      ) : null}
    </a>
  );
}

export function FooterInfoCards() {
  return (
    <div className="space-y-3 px-4 pb-2">
      <FooterLinkCard
        href={PADLET_BOARD.href}
        title={PADLET_BOARD.label}
        description={PADLET_BOARD.helper}
        external
        icon={<IconPadlet className="h-6 w-6" />}
        iconClassName="bg-gradient-to-br from-rose-50 via-amber-50 to-sky-100 ring-1 ring-border/60"
      />
      <FooterLinkCard
        href={INQUIRY_CONTACT.href}
        title={INQUIRY_CONTACT.label}
        description="궁금한 점은 담임 선생님께 문의해 주세요."
        icon={<IconQuestion className="h-5 w-5" />}
        iconClassName="bg-primary-light text-primary"
      />
    </div>
  );
}
