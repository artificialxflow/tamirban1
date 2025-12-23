import { AppShell } from "@/components/layout/app-shell";
import { StoriesPageClient } from "@/components/stories/stories-page-client";

export default function StoriesPage() {
  return (
    <AppShell
      title="مدیریت استوری‌ها"
      description="ایجاد و مدیریت استوری‌ها برای نمایش در اپلیکیشن مشتری"
      activeHref="/dashboard/stories"
    >
      <StoriesPageClient />
    </AppShell>
  );
}

