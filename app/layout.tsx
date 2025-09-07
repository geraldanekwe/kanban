import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "A modern, responsive task management application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased m-0 p-0 h-full`}>
        <ToastProvider>
          <NavBar />
          <main className="pt-16">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
