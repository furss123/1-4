import Image from "next/image";
import { APP_CLASS_LABEL, APP_SUBTITLE, APP_TITLE, SCHOOL_NAME } from "@/lib/constants";
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
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold leading-snug text-school">{APP_CLASS_LABEL}</p>
          <h1 className="mt-1 text-[1.5rem] font-bold leading-tight tracking-tight text-school">
            {APP_TITLE}
          </h1>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-ink-muted">{APP_SUBTITLE}</p>
        </div>
      </div>
    </header>
  );
}
