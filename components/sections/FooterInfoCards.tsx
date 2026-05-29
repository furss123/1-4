import { IconQuestion } from "@/components/icons";
import { INQUIRY_CONTACT } from "@/lib/constants";

export function FooterInfoCards() {
  return (
    <div className="px-4 pb-2">
      <a
        href={INQUIRY_CONTACT.href}
        className="flex items-center gap-3 rounded-card bg-card p-4 shadow-card transition-transform active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
          <IconQuestion className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <span className="text-sm font-bold text-school">문의하기</span>
          <p className="mt-0.5 text-xs font-medium leading-relaxed text-ink-muted">
            궁금한 점은 담임 선생님께 문의해 주세요.
          </p>
        </div>
      </a>
    </div>
  );
}
