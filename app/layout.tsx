import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadMagnet — LinkedIn, Instagram & Gmail Lead Automation for Agencies",
  description: "LeadMagnet helps agencies capture engaged leads from LinkedIn and Instagram campaigns, manage outreach, and automate Gmail follow-ups from one dashboard. Start your 7-day free trial today.",
  keywords: "lead generation, LinkedIn automation, Instagram automation, Gmail sequences, agency dashboard, lead magnet, outreach automation",
  openGraph: {
    title: "LeadMagnet — Lead Automation for Agencies",
    description: "Capture engaged leads from LinkedIn and Instagram. Automate Gmail follow-ups. Manage all your clients from one dashboard.",
    url: "https://leadmagnetinc.com",
    siteName: "LeadMagnet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadMagnet — Lead Automation for Agencies",
    description: "Capture engaged leads from LinkedIn and Instagram. Automate Gmail follow-ups. Manage all your clients from one dashboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}