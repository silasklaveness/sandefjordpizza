"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UserTabs from "@/components/layout/UserTabs";
import { User } from "lucide-react";
import { UseProfile } from "@/components/UseProfile";
import LogoLoader from "@/components/ui/logoloader";

const roleColors = {
  Admin: "bg-red-500",
  Employee: "bg-blue-500",
  Customer: "bg-green-500",
};

export default function UsersPage() {
  const { loading, data } = UseProfile();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        const usersWithRoles = data.map((user) => ({
          ...user,
          role: user.admin ? "Admin" : user.employee ? "Employee" : "Customer",
        }));
        setUsers(usersWithRoles);
        setFilteredUsers(usersWithRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedRole === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.role === selectedRole));
    }
  }, [selectedRole, users]);

  function handleRoleChange(e) {
    setSelectedRole(e.target.value);
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

  if (!data.admin) {
    return <div>Not authorized</div>;
  }

  return (
    <section className="mt-8 mx-auto max-w-2xl">
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400">
          User Management
        </h1>
        <div className="mb-4">
          <label htmlFor="role-filter" className="mr-2 text-gray-300">
            Filter by role:
          </label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={handleRoleChange}
            className="bg-gray-800 text-white rounded px-2 py-1"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-gray-900 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {user.name}
                    </h2>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded ${
                      roleColors[user.role]
                    }`}
                  >
                    {user.role}
                  </span>
                  <Link
                    href={`/dashboard/users/${user._id}`}
                    className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
