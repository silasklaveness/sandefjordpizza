"use client";

import UserTabs from "@/components/layout/UserTabs";
import { UseProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, User } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const { loading, data } = UseProfile();

  useEffect(() => {
    fetch("/api/users").then((response) => {
      response.json().then((users) => {
        setUsers(users);
      });
    });
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
        <div className="text-2xl font-bold text-red-500">Not an admin</div>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-4">
      <UserTabs isAdmin={true} />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.name ? (
                        user.name
                      ) : (
                        <span className="italic text-gray-500">No name</span>
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/users/${user._id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-gray-500">No users found</div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
