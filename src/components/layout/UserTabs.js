"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const tabVariants = {
  default: { opacity: 0.7 },
  active: { opacity: 1 },
};

export default function UserTabs({ isAdmin }) {
  const path = usePathname();

  const tabs = [
    { name: "Profile", href: "/profile", adminOnly: false },
    { name: "Categories", href: "/categories", adminOnly: true },
    { name: "Menu Items", href: "/menu-items", adminOnly: true },
    { name: "Users", href: "/users", adminOnly: true },
    { name: "Orders", href: "/orders", adminOnly: true },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8 shadow-md">
      <CardContent className="p-1">
        <nav className="flex flex-wrap justify-center gap-1">
          {tabs.map((tab) => {
            if (tab.adminOnly && !isAdmin) return null;

            const isActive =
              tab.href === path ||
              (tab.href !== "/profile" && path.includes(tab.href));

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex-1 min-w-[120px] py-3 px-4 text-center rounded-md transition-all duration-200 ease-in-out",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted"
                )}
              >
                <motion.div
                  variants={tabVariants}
                  initial="default"
                  animate={isActive ? "active" : "default"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium"
                >
                  {tab.name}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
