import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "IntellixChat - AI Assistant",
  description: "Experience the next generation of AI-driven editorial excellence.",
  icons: {
    icon: "/assets/images/intellixChat.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <LayoutWrapper>{children}</LayoutWrapper>
    </html>
  );
}
