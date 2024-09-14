"use client";

import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit2 } from "lucide-react";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const { loading, data } = UseProfile();

  useEffect(() => {
    fetch("/api/menu-items").then((res) =>
      res.json().then((menuItems) => {
        setMenuItems(menuItems);
      })
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!data.admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-500">
          You are not allowed to access this page.
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-4">
      <UserTabs isAdmin={data.admin} />
      <div className="mt-8">
        <h1 className="text-primary text-3xl font-bold mb-4">Menu Items</h1>
        <Card>
          <CardContent className="p-4">
            <Link href="/menu-items/new">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create new menu item
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Edit menu items:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems?.length > 0 &&
            menuItems.map((item) => (
              <Link href={`/menu-items/edit/${item._id}`} key={item._id}>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-2">
                      <Image
                        className="rounded-md object-cover"
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                      />
                    </div>
                    <h3 className="text-center font-medium text-lg mb-2">
                      {item.name}
                    </h3>
                    <Button variant="outline" className="w-full">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
