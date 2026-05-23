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
  title: "CardioGuard AI - Skrining Jantung",
  description: "Implementasi Hybrid AI (Klasifikasi Tabular & Ekstraksi Teks NLP) pada Sistem Skrining Penyakit Jantung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="id" 
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-200 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}