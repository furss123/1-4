import { APP_AUTHOR, APP_AUTHOR_LABEL } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(0px,calc(2rem-8mm))] text-center">
      <p className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-none">
        <span className="text-xs font-medium text-ink-muted">{APP_AUTHOR_LABEL}</span>
        <span
          className="rounded-md bg-white px-2 py-0.5 text-sm font-bold tracking-wide text-[#E07A9A] shadow-sm ring-1 ring-[#F5C6D6]/80"
          aria-label={APP_AUTHOR}
        >
          {APP_AUTHOR}
        </span>
      </p>
    </footer>
  );
}
