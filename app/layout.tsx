import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genesis 360º Empresarial",
  description: "Inteligência para pequenas e médias empresas crescerem com maturidade.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
