import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { siteUrl } from "../lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Keerthan Nandigama | SDE II at Amazon · Backend & Full-Stack Engineer",
    template: "%s | Keerthan Nandigama",
  },
  description:
    "Keerthan Nandigama is a Software Development Engineer II (SDE II) at Amazon in Seattle specializing in backend distributed systems on AWS, cloud architecture, and end-to-end software engineering. MS in Computer Engineering from Stony Brook University.",
  applicationName: "Keerthan Nandigama Portfolio",
  authors: [{ name: "Keerthan Nandigama", url: siteUrl.toString() }],
  creator: "Keerthan Nandigama",
  publisher: "Keerthan Nandigama",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  keywords: [
    "Keerthan Nandigama",
    "Software Engineer",
    "Software Development Engineer II",
    "SDE II Amazon",
    "Amazon Software Engineer Seattle",
    "Backend Engineer",
    "AWS",
    "Distributed Systems",
    "Full Stack Engineer",
    "Java",
    "TypeScript",
    "React Native",
    "CARS24",
    "NeoGrowth",
    "Stony Brook University",
    "NIT Durgapur",
    "Seattle Software Engineer",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Keerthan Nandigama",
    title: "Keerthan Nandigama | SDE II at Amazon · Backend & Full-Stack Engineer",
    description:
      "Software Development Engineer II at Amazon building backend distributed systems on AWS and shipping production software that delivers customer value.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keerthan Nandigama | SDE II at Amazon · Backend & Full-Stack Engineer",
    description:
      "Software Development Engineer II at Amazon building backend distributed systems on AWS and shipping production software that delivers customer value.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: siteUrl.toString(),
  mainEntity: {
    "@type": "Person",
    name: "Keerthan Nandigama",
    givenName: "Keerthan",
    familyName: "Nandigama",
    url: siteUrl.toString(),
    jobTitle: "Software Development Engineer II (SDE II)",
    description:
      "Software Development Engineer II at Amazon in Seattle specializing in backend distributed systems on AWS, cloud architecture, and full-stack software engineering.",
    worksFor: {
      "@type": "Organization",
      name: "Amazon",
      url: "https://www.amazon.com",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Seattle",
      addressRegion: "WA",
      addressCountry: "US",
    },
    sameAs: [
      "https://www.linkedin.com/in/keerthan-nandigama-b3b19b175/",
      "https://github.com/zoro8048",
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Stony Brook University",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "National Institute of Technology Durgapur",
      },
    ],
    award: [
      "Innovator of the Month (CARS24, Jan 2023)",
      "Best Coder of the Month (CARS24, Sep 2022)",
      "Rookie of the Quarter - Tech (CARS24, 2021 - 2022)",
      "Employee of the Month (NeoGrowth Credit Pvt. Ltd., Mar 2021)",
    ],
    knowsAbout: [
      "AWS",
      "Backend Systems",
      "Distributed Systems",
      "Java",
      "TypeScript",
      "JavaScript",
      "Spring Boot",
      "Node.js",
      "React",
      "Next.js",
      "React Native",
      "Swift",
      "Kotlin",
      "CI/CD",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
