import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";


const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aerophantom | Educator Ecosystem",
    template: "%s | Aerophantom",
  },
  description: "Aerophantom is a premium educator ecosystem portal helping teachers start their own Robotics Training Program. Get curriculum, hardware, and marketing support.",
  keywords: ["Robotics Education", "Teacher Training", "STEM", "Educator Program", "Student Management System", "Aerophantom"],
  authors: [{ name: "Aerophantom" }],
  creator: "Aerophantom",
  publisher: "Aerophantom",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aerophantom.com"), // Fallback if needed
  openGraph: {
    title: "Aerophantom | Educator Ecosystem",
    description: "Empowering educators to start their own Robotics Training Program with complete curriculum and support.",
    url: "https://aerophantom.com",
    siteName: "Aerophantom",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aerophantom | Educator Ecosystem",
    description: "Empowering educators to start their own Robotics Training Program with complete curriculum and support.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aerophantom",
  },
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased overflow-x-hidden`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster richColors closeButton={true} position="top-right" />
      </body>

    </html>
  );
}
