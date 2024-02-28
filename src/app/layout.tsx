import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "./redux/StoreProvider";

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

      <body >
      <StoreProvider>
        {children}
      </StoreProvider>
        </body>
    </html>
  );
}
