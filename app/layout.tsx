import type React from "react";
import type { Metadata, Viewport } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const sunsive = localFont({
  variable: "--font-sunsive",
  display: "swap",
  src: [
    {
      path: "../public/fonts/Sunsive-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Sunsive-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Sunsive-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Sunsive-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Sunsive-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Sunsive-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Hotela - Administration",
  description: "Panel administration du logiciel Hotela",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1f35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${montserrat.variable} ${geistMono.variable} ${sunsive.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {/* <AuthProvider> */} {children} <Toaster />
            {/* </AuthProvider>{" "} */}
          </Providers>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
