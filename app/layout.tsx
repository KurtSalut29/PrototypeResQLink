import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ResQLink — Biliran Island Emergency Response",
  description: "Fast. Safe. Reported. Emergency response app for Biliran Island, Philippines.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} style={{ height: "100%", overflow: "hidden" }}>
      <head>
        {/* Completely disable scrollIntoView and any scroll jump on the page */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // Override scrollIntoView so clicking elements never moves the page
            var orig = Element.prototype.scrollIntoView;
            Element.prototype.scrollIntoView = function() {};

            // Prevent any scroll on window/document
            function stopScroll(e) { e.preventDefault(); }
            document.addEventListener('scroll', stopScroll, { passive: false });
            window.addEventListener('scroll', stopScroll, { passive: false });

            // Lock scroll position to 0,0 always
            window.addEventListener('scroll', function() {
              window.scrollTo(0, 0);
            });
            document.addEventListener('scroll', function() {
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            });
          })();
        `}} />
      </head>
      <body style={{ height: "100%", overflow: "hidden", margin: 0, padding: 0, position: "fixed", width: "100%" }}>
        {children}
      </body>
    </html>
  );
}
