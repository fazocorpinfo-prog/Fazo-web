import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "FAZO — Raqamli g'oyalar galaktikasi",
  description: "We engineer digital galaxies. Web, Backend, Android, iOS, SMM.",
  metadataBase: new URL("https://fazo.uz"),
  openGraph: {
    title: "FAZO — Raqamli g'oyalar galaktikasi",
    description: "We engineer digital galaxies. Web, Backend, Android, iOS, SMM.",
    url: "https://fazo.uz",
    siteName: "FAZO",
    locale: "uz_UZ",
    type: "website",
    images: [{ url: "/fazo-logo.png", width: 512, height: 512, alt: "FAZO logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAZO — Raqamli g'oyalar galaktikasi",
    description: "We engineer digital galaxies. Web, Backend, Android, iOS, SMM.",
    images: ["/fazo-logo.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/fazo-logo.png",
    shortcut: "/fazo-logo.png",
    apple: "/fazo-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
