import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body className="bg-[#0f172a] text-slate-100 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
