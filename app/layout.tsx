import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SignalStocks — AI-Powered Stock Signals",
  description:
    "Institutional-grade trading signals powered by AI. +17% annualized backtest returns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5969348027694388"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[#0f172a] text-slate-100 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
