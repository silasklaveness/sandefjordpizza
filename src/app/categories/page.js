"use client";

import UserTabs from "@/components/layout/UserTabs";
import { useEffect, useState } from "react";
import { UseProfile } from "@/components/UseProfile";
import toast from "react-hot-toast";
import DeleteButton from "@/components/DeleteButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Edit2, X } from "lucide-react";

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const { loading: profileLoading, data: profileData } = UseProfile();
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch("/api/categories").then((res) => {
      res.json().then((categories) => {
        setCategories(categories);
      });
    });
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = { name: categoryName };
      if (editedCategory) {
        data._id = editedCategory._id;
      }
      const response = await fetch("/api/categories", {
        method: editedCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setCategoryName("");
      fetchCategories();
      setEditedCategory(null);
      if (response.ok) resolve();
      else reject();
    });
    await toast.promise(creationPromise, {
      loading: editedCategory ? "Updating category..." : "Creating category...",
      success: editedCategory ? "Category updated!" : "Category created!",
      error: "Error!",
    });
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/categories?_id=" + _id, {
        method: "DELETE",
      });
      if (response.ok) {
        resolve();
      } else {
        reject();
      }
    });
    await toast.promise(promise, {
      loading: "Deleting category...",
      success: "Category deleted!",
      error: "Error!",
    });
    fetchCategories();
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profileData.admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-red-500">Not an admin</div>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-4">
      <UserTabs isAdmin={true} />
      <h1 className="text-primary text-3xl font-bold mt-8 mb-4">Categories</h1>
      <Card>
        <CardContent>
          <form className="mt-4" onSubmit={handleCategorySubmit}>
            <div className="flex flex-col gap-4">
              <label className="font-medium text-gray-700">
                {editedCategory ? "Update category" : "Create new category"}
                {editedCategory && (
                  <>
                    : <span className="font-bold">{editedCategory.name}</span>
                  </>
                )}
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={categoryName}
                  onChange={(ev) => setCategoryName(ev.target.value)}
                  placeholder="Category name"
                  className="flex-grow"
                />
                <Button type="submit" className="flex-shrink-0">
                  {editedCategory ? (
                    <Edit2 className="w-4 h-4 mr-2" />
                  ) : (
                    <PlusCircle className="w-4 h-4 mr-2" />
                  )}
                  {editedCategory ? "Update" : "Create"}
                </Button>
                {editedCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditedCategory(null);
                      setCategoryName("");
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
        Existing categories
      </h2>
      <div className="grid gap-4">
        {categories?.length > 0 &&
          categories.map((c) => (
            <Card key={c._id} className="bg-white">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="text-lg font-medium">{c.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditedCategory(c);
                      setCategoryName(c.name);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <DeleteButton
                    label="Delete"
                    onDelete={() => handleDeleteClick(c._id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  );
}
