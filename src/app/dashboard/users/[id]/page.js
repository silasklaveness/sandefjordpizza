"use client";

import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditUserPage() {
  const { loading, data } = UseProfile();
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile?_id=" + id).then((res) => {
      res.json().then((user) => {
        setUser(user);
      });
    });
  }, [id]);

  async function handleSaveButtonClick(ev, data) {
    ev.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, _id: id }),
      });
      if (res.ok) resolve();
      else reject();
    });

    await toast.promise(promise, {
      loading: "Saving...",
      success: "User saved!",
      error: "Error!",
    });

    router.push("/users");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data.admin) {
    return <div>You are not an admin</div>;
  }

  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">Edit User</h1>
        {user ? (
          <UserForm user={user} onSave={handleSaveButtonClick} />
        ) : (
          <div>Loading user data...</div>
        )}
        <button
          onClick={() => router.push("/dashboard/users")}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to User List
        </button>
      </div>
    </section>
  );
}
