import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Merve & Devran Nişanı",
  description: "Nişan anılarınızı bizimle paylaşın",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
