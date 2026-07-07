import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Script from "next/script";

export const metadata: Metadata = {
  applicationName: "玄枢",
  title: {
    default: "玄枢｜免费八字排盘与结构化命盘报告",
    template: "%s · 玄枢",
  },
  description: "免费的中文八字排盘工具，提供四柱八字、五行、十神、地支关系、大运流年的结构化参考。",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/app-icon.svg",
    apple: "/app-icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "玄枢",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#0f1114",
  },
  openGraph: {
    title: "玄枢｜免费八字排盘与结构化命盘报告",
    description: "免费的中文八字排盘工具，提供四柱八字、五行、十神、地支关系、大运流年的结构化参考。",
    siteName: "玄枢",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
        <Script
          id="schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "玄枢",
              applicationCategory: "ReferenceApplication",
              operatingSystem: "All",
              description:
                "免费的中文八字排盘工具，提供四柱八字、五行、十神、地支关系、大运流年的结构化参考。",
              offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
            }),
          }}
        />
      </body>
    </html>
  );
}
