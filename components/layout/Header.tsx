import Image from "next/image";
import {
  APP_CLASS_BADGE,
  APP_SUBTITLE,
  APP_TITLE,
  SCHOOL_NAME,
} from "@/lib/constants";
import { publicAsset } from "@/lib/asset";

export function Header() {
  const logoSrc = publicAsset("/logo-namak.png");

  return (
    <header className="border-b border-border/50 bg-hero-gradient px-4 pb-4 pt-3.5">
      <div className="flex items-center gap-3">
        <Image
          src={logoSrc}
          alt={`${SCHOOL_NAME} 로고`}
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white"
          priority
          unoptimized
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[13px] font-bold text-school">{SCHOOL_NAME}</span>
            <span
              className="rounded-pill bg-white/80 px-2 py-0.5 text-[11px] font-bold text-primary shadow-sm ring-1 ring-border/40"
              aria-label="학년 반"
            >
              {APP_CLASS_BADGE}
            </span>
          </div>

          <h1 className="mt-1 text-[1.375rem] font-bold leading-tight tracking-tight text-ink">
            {APP_TITLE}
          </h1>

          <p className="mt-0.5 text-[11px] font-medium text-ink-subtle">{APP_SUBTITLE}</p>
        </div>
      </div>
    </header>
  );
}
