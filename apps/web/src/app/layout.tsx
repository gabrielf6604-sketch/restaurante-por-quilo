import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quilo | Gestão inteligente",
  description: "Plataforma de controle de consumo e atendimento para restaurante por quilo."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
