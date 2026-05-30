import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devran & Merve Nişanı",
  description: "Nişan anılarınızı bizimle paylaşın",
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
