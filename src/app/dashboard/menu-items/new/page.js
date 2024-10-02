"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UseProfile } from "@/components/UseProfile";
import UserTabs from "@/components/layout/UserTabs";
import MenuItemForm from "@/components/layout/MenuItemForm";
import Link from "next/link";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import LogoLoader from "@/components/ui/logoloader";

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
    router.push("/dashboard/menu-items"); // Redirect manually
  }

  if (redirectToItems) {
    console.log("Redirecting to /menu-items...");
    return null; // Redirection is handled by router.push
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LogoLoader size={75} color="#000000" />
        </div>
      </div>
    );
  }

  if (!data || !data.admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-500">Not an admin.</div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-4">
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle className="w-6 h-6" />
            Create New Menu Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Link href="/dashboard/menu-items">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Show all menu items
              </Button>
            </Link>
          </div>
          <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
        </CardContent>
      </Card>
    </section>
  );
}
