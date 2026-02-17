import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import { Toaster } from "sonner";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";
import { EarlyAccessGate } from "@/components/early-access-gate";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SimplySeat – Tische & Termine einfach buchen",
  description:
    "Reservieren Sie Ihren Tisch oder Termin bei Restaurants, Friseuren und weiteren Betrieben in Ihrer Nähe.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#c45c3e" },
    { media: "(prefers-color-scheme: dark)", color: "#c45c3e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geist.variable} ${dmSerifDisplay.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <CustomerAuthProvider>
          <EarlyAccessGate>{children}</EarlyAccessGate>
          <Toaster position="top-center" richColors closeButton />
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
