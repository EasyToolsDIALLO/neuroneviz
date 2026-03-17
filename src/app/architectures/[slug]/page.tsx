

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { buildMetadata, ARCH_SEO } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildCourseSchema, buildArticleSchema, buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import { Sidebar } from "@/components/layout/Sidebar";
import { ArchitectureTabs } from "@/components/tabs/ArchitectureTabs";

export const dynamic = "force-dynamic"; 
// ── generateStaticParams : pré-génère les 7 routes ───────────────────
/*export async function generateStaticParams() {
  const archs = await prisma.architecture.findMany({ select: { slug: true } });
  return archs.map((a) => ({ slug: a.slug }));
}*/

// ── generateMetadata ─────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = ARCH_SEO[slug];
  if (!meta) return {};
  return buildMetadata({ ...meta, path: `/architectures/${slug}`, type: "article" });
}

// ── Page ─────────────────────────────────────────────────────────────
export default async function ArchitecturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const architecture = await prisma.architecture.findUnique({
    where: { slug },
    include: { concept: true, simulation: true, codeImpl: true, fromScratch: true },
  });

  if (!architecture) notFound();

  const faqs = [
    { question: `Qu'est-ce qu'un ${architecture.shortName} ?`,                answer: architecture.description },
    { question: `À quoi sert un ${architecture.shortName} ?`,                 answer: architecture.concept?.introduction?.slice(0, 200) ?? "" },
    { question: `Comment implémenter un ${architecture.shortName} en Python ?`, answer: `Utilisez PyTorch : ${architecture.codeImpl?.title ?? ""}` },
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={buildCourseSchema(architecture)} />
      <JsonLd data={buildArticleSchema(architecture)} />
      <JsonLd data={buildFaqSchema(faqs)} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Accueil",       url: "https://neuroviz.app" },
        { name: "Architectures", url: "https://neuroviz.app/architectures" },
        { name: architecture.shortName, url: `https://neuroviz.app/architectures/${slug}` },
      ])} />

      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* Sidebar
        <Sidebar currentSlug={slug} />  */}

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-white border-b border-slate-100 px-8 py-6">
            {/* Breadcrumb */}
            <nav aria-label="Fil d'Ariane" className="text-xs text-slate-400 mb-3">
              <ol className="flex items-center gap-1.5">
                <li><a href="/" className="hover:text-indigo-600">Accueil</a></li>
                <li>/</li>
                <li><a href="/architectures" className="hover:text-indigo-600">Architectures</a></li>
                <li>/</li>
                <li className="text-slate-600 font-medium">{architecture.shortName}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow"
                style={{ backgroundColor: architecture.color }}
              >
                {architecture.shortName.slice(0, 2)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{architecture.name}</h1>
                <p className="text-slate-500 text-sm mt-0.5">{architecture.description}</p>
              </div>
            </div>
          </header>

          {/* Tabs */}
          <div className="px-8 py-6">
            <ArchitectureTabs
              slug={slug}
              color={architecture.color}
              concept={architecture.concept}
              simulation={architecture.simulation}
              codeImpl={architecture.codeImpl}
              fromScratch={architecture.fromScratch}
            />
          </div>
        </main>
      </div>
    </>
  );
}