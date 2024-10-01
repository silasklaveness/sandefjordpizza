"use client";
import { Roboto } from "next/font/google";
import "../globals.css";
import AppProvider from "@/components/AppContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function RootLayout({ children }) {
  const { loading, data } = UseProfile();

  if (!data || loading) {
    return <div>Loading...</div>; // Combine loading and data checks
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <main className="">
          <AppProvider>
            <Toaster />
            <UserTabs isAdmin={data.admin} />
            {children}
          </AppProvider>
          <Analytics />
        </main>
      </body>
    </html>
  );
}
