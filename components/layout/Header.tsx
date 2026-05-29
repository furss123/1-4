import Image from "next/image";
import { APP_CLASS_LABEL, APP_SUBTITLE, APP_TITLE, SCHOOL_NAME } from "@/lib/constants";
import { publicAsset } from "@/lib/asset";

export function Header() {
  const logoSrc = publicAsset("/logo-namak.png");

  return (
    <header className="bg-hero-gradient">
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <Image
          src={logoSrc}
          alt={`${SCHOOL_NAME} 로고`}
          width={72}
          height={72}
          className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover shadow-card ring-[3px] ring-white"
          priority
          unoptimized
        />
        <p className="min-w-0 text-lg font-bold leading-snug text-school">{APP_CLASS_LABEL}</p>
      </div>

      <div className="px-4 pb-6 pt-1">
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-school">
          {APP_TITLE}
        </h1>
        <p className="mt-2 text-sm font-medium leading-relaxed text-ink-muted">{APP_SUBTITLE}</p>
      </div>
    </header>
  );
}
