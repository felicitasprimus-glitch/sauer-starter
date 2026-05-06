import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "Sauer macht Krustig — Starter Tagebuch",
  description:
    "Dein Sauerteig-Starter im Blick: Fütterung, Peak und alle Aha-Momente.",
};

export const viewport = {
  themeColor: "#FAF6F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-body min-h-screen">{children}</body>
    </html>
  );
}
