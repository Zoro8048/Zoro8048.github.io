import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keerthan Nandigama | Software Engineer",
  description:
    "Portfolio of Keerthan Nandigama, a software engineer building user-focused applications.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
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
