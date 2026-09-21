import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genesis 360º Empresarial",
  description: "Inteligência empresarial confiável para transformar informação em decisões e resultados.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
