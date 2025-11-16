import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "A Marceneira - Sistema de Briefing e Medições",
  description: "Sistema completo para marcenaria: briefing, medições e gestão de projetos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-inter antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
