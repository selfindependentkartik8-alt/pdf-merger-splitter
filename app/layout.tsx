import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://pdfmergersplitter.krishaiworks.com"
  ),

  title: "PDF Merger & Splitter | Merge and Split PDF Files Online",

  description:
    "Merge multiple PDF files into one or split PDF documents into separate files online. Use the free PDF Merger & Splitter by KrishAIWorks.",

  keywords: [
    "PDF Merger",
    "PDF Splitter",
    "PDF Merger and Splitter",
    "Merge PDF",
    "Split PDF",
    "Merge PDF Online",
    "Split PDF Online",
    "PDF Merger Online",
    "PDF Splitter Online",
    "Free PDF Merger",
    "Free PDF Splitter",
  ],

  authors: [
    {
      name: "KrishAIWorks",
      url: "https://krishaiworks.vercel.app",
    },
  ],

  creator: "KrishAIWorks",
  publisher: "KrishAIWorks",

  alternates: {
    canonical:
      "https://pdfmergersplitter.krishaiworks.com/",
  },

  openGraph: {
    title: "PDF Merger & Splitter | KrishAIWorks",
    description:
      "Merge multiple PDF files or split PDF documents online quickly and easily with KrishAIWorks.",
    url: "https://pdfmergersplitter.krishaiworks.com/",
    siteName: "KrishAIWorks",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "PDF Merger & Splitter | KrishAIWorks",
    description:
      "Merge and split PDF files online quickly and easily.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}