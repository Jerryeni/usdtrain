import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import Script from "next/script";
import { PresaleProvider } from "../../providers/provider";
import { WalletProvider } from "../../lib/wallet";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "USDT RAIN - Cryptocurrency Referral Platform",
  description: "Multi-level cryptocurrency referral platform with global pool rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} antialiased`}
      >
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          strategy="afterInteractive"
        />
        <Script
          id="fontawesome-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.FontAwesomeConfig = { autoReplaceSvg: 'nest'}`,
          }}
        />
        <WalletProvider>
          <PresaleProvider>
            {children}
          </PresaleProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
