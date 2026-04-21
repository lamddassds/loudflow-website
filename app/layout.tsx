import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoudFlow — Hear anything, instantly.",
  description: "Turn any text into natural speech — instantly, with a hotkey.",
  metadataBase: new URL("https://loudflow.xyz"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "LoudFlow — Hear anything, instantly.",
    description: "Turn any text into natural speech — instantly, with a hotkey.",
    url: "https://loudflow.xyz",
    siteName: "LoudFlow",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoudFlow — Hear anything, instantly.",
    description: "Turn any text into natural speech — instantly, with a hotkey.",
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
