import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DNS Lookup",
  description: "Made with love by pradipta",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Lookup" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[length:60px_60px] bg-[linear-gradient(to_right,_rgba(100,100,100,0.15)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(100,100,100,0.15)_1px,_transparent_1px)]" style={{ backgroundColor: 'oklch(94.61% 0.043 211.12)' }}>
          <div className="grid min-h-screen grid-rows-[auto_1fr_auto] mx-10">
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
