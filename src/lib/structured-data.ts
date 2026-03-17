const BASE = "https://neuroviz.app";

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NeuroViz",
  url: BASE,
  description: "Visualisations interactives pour comprendre les réseaux de neurones",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NeuroViz", url: BASE,
  logo: `${BASE}/logo.png`,
  sameAs: ["https://twitter.com/neuroviz_app", "https://github.com/neuroviz"],
};

export function buildCourseSchema(arch: { slug: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: arch.name, description: arch.description,
    url: `${BASE}/architectures/${arch.slug}`,
    provider: { "@type": "Organization", name: "NeuroViz", url: BASE },
    educationalLevel: "University",
    inLanguage: "fr",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };
}

export function buildArticleSchema(arch: { slug: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `Comprendre ${arch.name} — Visualisations & Implémentation`,
    description: arch.description,
    url: `${BASE}/architectures/${arch.slug}`,
    author: { "@type": "Organization", name: "NeuroViz" },
    publisher: {
      "@type": "Organization",
      name: "NeuroViz",
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
    },
    datePublished: "2025-01-01",
    dateModified:  "2025-01-01", // ← static date, no new Date()
    inLanguage: "fr",
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}