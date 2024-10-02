"use client";
import { Roboto } from "next/font/google";
import "../globals.css";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function RootLayout({ children }) {
  const { loading, data } = UseProfile();

  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <UserTabs isAdmin={data.admin} />
        {children}
      </body>
    </html>
  );
}
