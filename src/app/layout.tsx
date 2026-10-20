import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HV Garage — Автоелектрика та діагностика",
  description: "Автодіагностика, автоелектрика та встановлення обладнання. HV Garage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
