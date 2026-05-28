import { IconCalendar } from "@/components/icons";
import { ANNOUNCEMENT } from "@/lib/constants";

export function AnnouncementBanner() {
  return (
    <section
      className="mx-4 flex items-start gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3.5 shadow-sm"
      aria-labelledby="announcement-title"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        <IconCalendar />
      </span>
      <div className="min-w-0 pt-0.5">
        <h2 id="announcement-title" className="text-sm font-bold text-ink">
          {ANNOUNCEMENT.title}
        </h2>
        <p className="mt-0.5 text-xs font-medium leading-relaxed text-ink-muted">
          {ANNOUNCEMENT.caption}
        </p>
      </div>
    </section>
  );
}
