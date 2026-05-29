import Image from "next/image";
import { APP_CLASS_LABEL, APP_TITLE, SCHOOL_NAME } from "@/lib/constants";
import { publicAsset } from "@/lib/asset";

export function Header() {
  const logoSrc = publicAsset("/logo-namak-transparent.png");

  return (
    <header className="bg-hero-gradient px-4 pb-[4mm] pt-4">
      <div className="flex items-center gap-3">
        <Image
          src={logoSrc}
          alt={`${SCHOOL_NAME} 로고`}
          width={72}
          height={72}
          className="h-[4.5rem] w-[4.5rem] shrink-0 object-contain drop-shadow-sm"
          priority
          unoptimized
        />
        <div className="flex h-[4.5rem] min-w-0 flex-1 flex-col justify-center gap-[2pt]">
          <p className="text-[1.5625rem] font-bold leading-none text-school">{APP_CLASS_LABEL}</p>
          <h1 className="text-[2.75rem] font-bold leading-none tracking-tight text-school">
            {APP_TITLE}
          </h1>
        </div>
      </div>
    </header>
  );
}
