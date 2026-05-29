import Image from "next/image";
import {
  APP_AUTHOR,
  APP_AUTHOR_LABEL,
  APP_CLASS_LABEL,
  APP_TITLE,
  SCHOOL_NAME,
} from "@/lib/constants";
import { publicAsset } from "@/lib/asset";

export function Header() {
  const logoSrc = publicAsset("/logo-namak.png");

  return (
    <header className="bg-hero-gradient px-4 pb-[4mm] pt-4">
      <div className="flex items-center gap-3">
        <Image
          src={logoSrc}
          alt={`${SCHOOL_NAME} 로고`}
          width={72}
          height={72}
          className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover shadow-card ring-[3px] ring-white"
          priority
          unoptimized
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="text-base font-bold leading-snug text-school">{APP_CLASS_LABEL}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <h1 className="text-[1.5rem] font-bold leading-tight tracking-tight text-school">
              {APP_TITLE}
            </h1>
            <span className="inline-flex items-center gap-1.5 leading-none">
              <span className="text-xs font-medium text-ink-muted">{APP_AUTHOR_LABEL}</span>
              <span
                className="rounded-md bg-white px-2 py-0.5 text-sm font-bold tracking-wide text-school shadow-sm ring-1 ring-primary/25"
                aria-label={APP_AUTHOR}
              >
                {APP_AUTHOR}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
