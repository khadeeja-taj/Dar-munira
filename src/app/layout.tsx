import type { Metadata, Viewport } from "next";
import { Marcellus, Manrope, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/provider";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});
// Clean, modern Arabic sans-serif (used for both Arabic body and headings).
const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Dar Munira";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — International Islamic University Islamabad`,
    template: `%s · ${siteName}`,
  },
  description:
    "Dar Munira is an Islamic learning center at the International Islamic University Islamabad dedicated to teaching the Qur'an, Tajweed, Hadith, Aqeedah, and the Islamic sciences.",
  keywords: [
    "Dar Munira",
    "IIUI",
    "Quran",
    "Tajweed",
    "Hifz",
    "Islamic sciences",
    "Islamabad",
  ],
  authors: [{ name: "Roqaya K7an" }],
  openGraph: {
    title: `${siteName} — IIUI`,
    description:
      "Qur'an & Islamic Sciences — student registration, instructor applications, and more.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B5D3B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${marcellus.variable} ${manrope.variable} ${notoArabic.variable}`}
    >
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
