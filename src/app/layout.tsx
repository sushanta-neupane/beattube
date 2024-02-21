import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "beatTube",
  description:  `A platform for downloading and listening music`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
