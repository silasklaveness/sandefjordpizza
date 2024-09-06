"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UseProfile } from "@/components/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import MenuItemForm from "@/components/layout/MenuItemForm";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewMenuItemPage() {
  console.log("NewMenuItemPage is rendering...");

  const router = useRouter();
  const [redirectToItems, setRedirectToItems] = useState(false);
  const { loading, data } = UseProfile();

  useEffect(() => {
    console.log("loading:", loading);
    console.log("data:", data);
  }, [loading, data]);

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    console.log("Form submitted with data:", data);

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(savingPromise, {
      loading: "Saving this tasty item",
      success: "Saved",
      error: "Error",
    });

    setRedirectToItems(true);
    router.push("/menu-items"); // Redirect manually
  }

  if (redirectToItems) {
    console.log("Redirecting to /menu-items...");
    return null; // Redirection is handled by router.push
  }

  if (loading) {
    return <p>Loading user info...</p>;
  }

  if (!data || !data.admin) {
    return <p>Not an admin.</p>;
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href={"/menu-items"} className="button">
          <span>Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
    </section>
  );
}
