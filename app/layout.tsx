import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://krishaiworks.com/#organization",
      name: "KrishAIWorks",
      url: "https://krishaiworks.com",
      logo: {
        "@type": "ImageObject",
        url: "https://krishaiworks.com/logo.png",
        width: 512,
        height: 512,
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://krishaiworks.com/#website",
      url: "https://krishaiworks.com",
      name: "KrishAIWorks",
      description:
        "AI-powered tools, productivity utilities, automation, chatbots, websites and custom digital solutions.",
      publisher: {
        "@id": "https://krishaiworks.com/#organization",
      },
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id":
        "https://pdfmergersplitter.krishaiworks.com/#webapplication",
      name: "PDF Merger & Splitter",
      url: "https://pdfmergersplitter.krishaiworks.com/",
      description:
        "Merge multiple PDF files into one or split PDF documents into separate files online. Use the free PDF Merger & Splitter by KrishAIWorks.",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser.",
      isPartOf: {
        "@id": "https://krishaiworks.com/#website",
      },
      publisher: {
        "@id": "https://krishaiworks.com/#organization",
      },
    },
    {
      "@type": "WebPage",
      "@id":
        "https://pdfmergersplitter.krishaiworks.com/#webpage",
      url: "https://pdfmergersplitter.krishaiworks.com/",
      name: "PDF Merger & Splitter | Merge and Split PDF Files Online",
      description:
        "Merge multiple PDF files into one or split PDF documents into separate files online. Use the free PDF Merger & Splitter by KrishAIWorks.",
      isPartOf: {
        "@id": "https://krishaiworks.com/#website",
      },
      about: {
        "@id":
          "https://pdfmergersplitter.krishaiworks.com/#webapplication",
      },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <script
          id="pdf-merger-splitter-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BS6TSMM1ZR"
          strategy="lazyOnload"
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BS6TSMM1ZR');
          `}
        </Script>
      </body>
    </html>
  );
}