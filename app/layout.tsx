import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoudFlow — Coming Soon",
  description: "LoudFlow is launching soon. Hear anything, instantly.",
  metadataBase: new URL("https://loudflow.xyz"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "LoudFlow — Coming Soon",
    description: "LoudFlow is launching soon. Hear anything, instantly.",
    url: "https://loudflow.xyz",
    siteName: "LoudFlow",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoudFlow — Coming Soon",
    description: "LoudFlow is launching soon. Hear anything, instantly.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
