import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cozy Cafe",
  description: "A cozy little pretend cafe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <>
        <>Cozi Cafe</>
        <br />
        <>
          <Link href="/" style={{ paddingRight: "5px" }}>
            Home
          </Link>
          <Link href="/menu" style={{ paddingRight: "5px" }}>
            Menu
          </Link>
          <Link href="/events" style={{ paddingRight: "5px" }}>
            Events
          </Link>
          <Link href="/order" style={{ paddingRight: "5px" }}>
            Order
          </Link>
          <Link href="/about">About</Link>
        </>
      </>
      <body>{children}</body>
    </html>
  );
}
