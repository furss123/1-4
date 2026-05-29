import Image from "next/image";
import { PadletShortcutLink } from "@/components/layout/PadletShortcutLink";
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
    <header className="bg-hero-gradient px-4 pb-6 pt-4">
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
            <span className="inline-flex items-baseline gap-1.5 text-sm leading-none">
              <span className="font-medium tracking-wide text-ink-subtle">{APP_AUTHOR_LABEL}</span>
              <span className="relative font-semibold italic tracking-[0.03em]">
                <span
                  className="bg-gradient-to-r from-school via-primary to-[#5B9BEF] bg-clip-text text-transparent"
                  aria-label={APP_AUTHOR}
                >
                  {APP_AUTHOR}
                </span>
                <span
                  className="pointer-events-none absolute -bottom-px left-0 h-px w-full bg-gradient-to-r from-school/50 via-primary/60 to-transparent"
                  aria-hidden
                />
              </span>
            </span>
          </div>
        </div>
        <PadletShortcutLink className="self-center" />
      </div>
    </header>
  );
}
