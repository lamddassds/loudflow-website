import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoudFlow — Hear anything, instantly",
  description:
    "A floating pill that reads any text aloud in a natural AI voice. Press a hotkey, listen to anything — articles, emails, docs, code. Free for Windows, macOS & Linux.",
  metadataBase: new URL("https://loudflow.xyz"),
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "LoudFlow — Hear anything, instantly",
    description:
      "A floating pill that reads any text aloud. Press a hotkey — listen to any article, email, doc, or code in a natural AI voice.",
    url: "https://loudflow.xyz",
    siteName: "LoudFlow",
    images: [{ url: "/icon.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoudFlow — Hear anything, instantly",
    description:
      "Press a hotkey, listen to anything in a natural AI voice.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-ink-950 text-white antialiased">{children}</body>
    </html>
  );
}
