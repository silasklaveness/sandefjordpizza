"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenyItem from "@/components/meny/MenyItem";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    fetch("api/categories").then((res) => {
      res.json().then((categories) => setCategories(categories));
    });
    fetch("api/menu-items").then((res) => {
      res.json().then((menuItems) => setMenuItems(menuItems));
    });
  }, []);
  return (
    <section className="mt-8">
      {categories?.length > 0 &&
        categories.map((c) => (
          <div>
            <div className="text-center">
              <SectionHeaders mainHeader={c.name} />
            </div>
            <div className="grid grid-cols-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4 mt-6 mb-12">
              {menuItems
                .filter((m) => m.category === c._id)
                .map((item) => (
                  <MenyItem key={item._id} {...item} />
                ))}
            </div>
          </div>
        ))}
    </section>
  );
}
