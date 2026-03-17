import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { buildMetadata, SITE_DESC, SITE_NAME } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { websiteSchema, organizationSchema } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: `${SITE_NAME} — Réseaux de Neurones Interactifs`,
  description: SITE_DESC,
  path: "/",
});

export default async function HomePage() {
  const architectures = await prisma.architecture.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true, shortName: true, icon: true, color: true, description: true },
  });

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />

      <main className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-white border-b border-slate-100 py-20 px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Comprendre les Réseaux de Neurones
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Visualisations interactives · Simulations pas-à-pas · Code PyTorch · Formules mathématiques
          </p>
        </section>

        {/* Grid architectures */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">
            7 Architectures Expliquées
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {architectures.map((arch) => (
              <Link
                key={arch.slug}
                href={`/architectures/${arch.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:border-slate-200 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: arch.color }}
                  >
                    {arch.shortName.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{arch.shortName}</p>
                    <p className="text-xs text-slate-400">{arch.name}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{arch.description}</p>
                <span
                  className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                  style={{ color: arch.color }}
                >
                  Explorer <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}