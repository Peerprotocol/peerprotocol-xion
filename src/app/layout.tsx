import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { DarkModeProvider } from "./LandingPage/DarkMode";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peer Protocol",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <DarkModeProvider>
        <body className={inter.className}>
          {children}
          
          </body>
      </DarkModeProvider>
    </html>
  );
}
