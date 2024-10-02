"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserForm from "@/components/layout/UserForm";
import LogoLoader from "@/components/ui/logoloader";

export default function ProfilePage() {
  const session = useSession();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const { status } = session;
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile").then((respone) => {
        respone.json().then((data) => {
          setUser(data);
          setIsAdmin(data.admin);
          setProfileFetched(true);
        });
      });
    }
  }, [session, status]);

  async function handleProfileInfoUpdate(ev, data) {
    ev.preventDefault();
    console.log(data);

    const savingPromise = new Promise(async (resolve, reject) => {
      const respone = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (respone.ok) resolve();
      else reject();
    });

    await toast.promise(savingPromise, {
      loading: "Saving...",
      success: "Profile Saved!",
      error: "Error!",
    });
  }

  if (status === "loading" || !profileFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LogoLoader size={75} color="#000000" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <section className="mt-8">
      <UserForm user={user} onSave={handleProfileInfoUpdate} />
      <div className="max-w-2xl mx-auto mt-8"></div>
    </section>
  );
}
