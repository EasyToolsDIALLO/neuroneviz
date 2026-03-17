import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { buildMetadata, SITE_DESC, SITE_NAME } from "@/lib/seo";

// Geist est intégré nativement dans Next.js 16
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = buildMetadata({
  title: `${SITE_NAME} — Réseaux de Neurones Interactifs`,
  description: SITE_DESC,
  path: "/",
  keywords: [
    "réseau de neurones interactif",
    "deep learning visualisation",
    "CNN RNN LSTM GRU GNN Transformers LLM",
    "cours deep learning gratuit",
    "neural network simulation",
  ],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="icon"             href="/favicon.ico" sizes="any" />
        <link rel="icon"             href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest"         href="/manifest.webmanifest" />
        <meta name="theme-color"     content="#6366f1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-slate-50`}>
        {children}

        {/* Google Analytics 4 — strategy="afterInteractive" ne bloque pas le rendu */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new (Function('return Date')())());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}