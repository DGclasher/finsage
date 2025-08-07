import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinSage - Personal Finance Management",
  description: "Track your investments, income, and expenses with FinSage",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <Script src="/env.js" strategy="beforeInteractive" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
