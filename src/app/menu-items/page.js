"use client";
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
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
    return <div>Loading...</div>;
  }

  if (!data.admin) {
    return (
      <div>
        <p>You are not allowed to access this page.</p>
      </div>
    );
  }

  return (
    <section className="mt-8 ">
      <UserTabs isAdmin={data.admin} />
      <div className="mt-8 max-w-xl mx-auto">
        <Link className="button flex" href={"/menu-items/new"}>
          Create new menu item
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        <div className="grid grid-cols-3 gap-2">
          {menuItems?.length > 0 &&
            menuItems.map((item) => (
              <Link
                href={`/menu-items/edit/` + item._id}
                className="bg-gray-200 rounded-lg p-4"
                key={item._id}
              >
                <div className="relative">
                  <Image
                    className="rounded-md"
                    src={item.image}
                    alt={""}
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-center">{item.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
