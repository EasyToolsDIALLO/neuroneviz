import { Sidebar } from "@/components/layout/Sidebar";

export default async function ArchitecturesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar currentSlug={slug} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}