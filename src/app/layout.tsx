import type { Metadata } from "next";
import {Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";
import Provider from "./components/Provider";
import { constructMetadata } from "@/lib/utils";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata  =constructMetadata()



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        <Navbar/>

        <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
          <div className="flex flex-col h-full flex-1">
           <Provider>{children}</Provider>
          </div>
        </main>
        <Footer/>
        <Toaster/>
        </body>
    </html>
  );
}
