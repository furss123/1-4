import { IconCalendar } from "@/components/icons";
import { ANNOUNCEMENT } from "@/lib/constants";

export function AnnouncementBanner() {
  return (
    <section
      className="mx-4 flex items-start gap-3 rounded-card bg-card px-4 py-4 shadow-card"
      aria-labelledby="announcement-title"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        <IconCalendar className="h-5 w-5" />
      </span>
      <div className="min-w-0 pt-0.5">
        <h2 id="announcement-title" className="text-sm font-bold text-school">
          {ANNOUNCEMENT.title}
        </h2>
        <p className="mt-1 text-xs font-medium leading-relaxed text-ink-muted">
          {ANNOUNCEMENT.caption}
        </p>
      </div>
    </section>
  );
}
