"use client";

import UserTabs from "@/components/layout/UserTabs";
import { useEffect, useState } from "react";
import { UseProfile } from "@/components/UseProfile";
import toast from "react-hot-toast";
import DeleteButton from "@/components/DeleteButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit2, X, Folder, FolderPlus } from "lucide-react";

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const { loading: profileLoading, data: profileData } = UseProfile();
  const [editedCategory, setEditedCategory] = useState(null);
  const [isSubcategory, setIsSubcategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Categories data is not an array:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();
    const data = {
      name: categoryName,
      parent: parentCategory,
    };
    if (editedCategory) {
      data._id = editedCategory._id;
    }
    try {
      const response = await fetch("/api/categories", {
        method: editedCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setCategoryName("");
        setParentCategory(null);
        setIsSubcategory(false);
        fetchCategories();
        setEditedCategory(null);
        toast.success(
          editedCategory
            ? isSubcategory
              ? "Subcategory updated!"
              : "Category updated!"
            : isSubcategory
            ? "Subcategory created!"
            : "Category created!"
        );
      } else {
        toast.error("Error!");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("Error!");
    }
  }

  async function handleDeleteClick(_id) {
    try {
      const response = await fetch(`/api/categories?_id=${_id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (response.ok) {
        fetchCategories();
        toast.success("Category deleted!");
      } else {
        toast.error(result.error || "Error deleting category!");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category!");
    }
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
    <section className="max-w-4xl mx-auto p-4">
      <UserTabs isAdmin={true} />
      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {editedCategory
                ? isSubcategory
                  ? "Update Subcategory"
                  : "Update Category"
                : isSubcategory
                ? "Create New Subcategory"
                : "Create New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">
                  {editedCategory && (
                    <span className="font-bold">{editedCategory.name}</span>
                  )}
                </label>
                <Input
                  type="text"
                  value={categoryName}
                  onChange={(ev) => setCategoryName(ev.target.value)}
                  placeholder={
                    isSubcategory ? "Subcategory name" : "Category name"
                  }
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
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
                      setParentCategory(null);
                      setIsSubcategory(false);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Existing Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <Card key={category._id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Folder className="w-5 h-5 text-primary" />
                          <span className="text-lg font-medium">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditedCategory(category);
                              setCategoryName(category.name);
                              setParentCategory(null);
                              setIsSubcategory(false);
                            }}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <DeleteButton
                            label="Delete"
                            onDelete={() => handleDeleteClick(category._id)}
                          />
                        </div>
                      </div>

                      {/* Subcategories */}
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="mt-4 pl-6 border-l-2 border-gray-200">
                            <h3 className="font-medium text-gray-700 mb-2">
                              Subcategories:
                            </h3>
                            <div className="space-y-2">
                              {category.subcategories.map((subcat) => (
                                <div
                                  key={subcat._id}
                                  className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm"
                                >
                                  <div className="flex items-center space-x-2">
                                    <FolderPlus className="w-4 h-4 text-gray-500" />
                                    <span>{subcat.name}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditedCategory(subcat);
                                        setCategoryName(subcat.name);
                                        setParentCategory(category._id);
                                        setIsSubcategory(true);
                                      }}
                                    >
                                      <Edit2 className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                    <DeleteButton
                                      label="Delete"
                                      onDelete={() =>
                                        handleDeleteClick(subcat._id)
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Button to add a new subcategory */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-4"
                        onClick={() => {
                          setEditedCategory(null);
                          setCategoryName("");
                          setParentCategory(category._id);
                          setIsSubcategory(true);
                        }}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Subcategory
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No categories found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
