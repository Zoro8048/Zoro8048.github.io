import type { Metadata } from "next";
import Script from "next/script";
import { siteUrl } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Keerthan Nandigama | Software Engineer",
    template: "%s | Keerthan Nandigama",
  },
  description:
    "Portfolio of Keerthan Nandigama, a software engineer building user-focused applications.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Keerthan Nandigama",
    title: "Keerthan Nandigama | Software Engineer",
    description:
      "Portfolio of Keerthan Nandigama, a software engineer building user-focused applications.",
  },
  twitter: {
    card: "summary",
    title: "Keerthan Nandigama | Software Engineer",
    description:
      "Portfolio of Keerthan Nandigama, a software engineer building user-focused applications.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Keerthan Nandigama",
  url: siteUrl.toString(),
  jobTitle: "Software Engineer",
  sameAs: ["https://www.linkedin.com/in/keerthan-nandigama-b3b19b175/"],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Stony Brook University",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "NIT Durgapur",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HVF1SDSMYS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HVF1SDSMYS');`}
        </Script>
      </body>
    </html>
  );
}
