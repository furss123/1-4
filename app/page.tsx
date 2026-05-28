import { AppShell } from "@/components/home/AppShell";
import { DataErrorBanner } from "@/components/sections/DataErrorBanner";
import { Header } from "@/components/layout/Header";
import { AnnouncementBanner } from "@/components/sections/AnnouncementBanner";
import { FooterInfoCards } from "@/components/sections/FooterInfoCards";
import { getAssessments } from "@/lib/google/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 60;

function ErrorLayout({ message }: { message: string }) {
  return (
    <>
      <Header />
      <main className="space-y-4 px-0 pt-3 pb-10">
        <AnnouncementBanner />
        <div className="px-4">
          <DataErrorBanner message={message} />
        </div>
        <FooterInfoCards />
      </main>
    </>
  );
}

export default async function HomePage() {
  let assessments: Awaited<ReturnType<typeof getAssessments>> = [];
  let fetchError: string | null = null;

  try {
    assessments = await getAssessments();
  } catch (error) {
    fetchError =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    console.error("[getAssessments]", error);
  }

  if (fetchError) {
    return <ErrorLayout message={fetchError} />;
  }

  if (assessments.length === 0) {
    return (
      <>
        <Header />
        <main className="space-y-4 pt-3 pb-10">
          <AnnouncementBanner />
          <p className="mx-4 rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm font-medium text-ink-muted">
            진행 중·마감 임박 수행평가가 없습니다.
          </p>
          <FooterInfoCards />
        </main>
      </>
    );
  }

  return <AppShell assessments={assessments} />;
}
