import Image from "next/image";
import toast from "react-hot-toast";
import { useState } from "react";
import { Upload, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditableImage({ link, setLink }) {
  const [isHovered, setIsHovered] = useState(false);

  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData();
      data.set("file", files[0]);

      const uploadPromise = fetch("/api/upload", {
        method: "POST",
        body: data,
      }).then((response) => {
        if (response.ok) {
          return response.json().then((link) => {
            setLink(link);
          });
        }
        throw new Error("Upload error");
      });

      await toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Image uploaded!",
        error: "Upload error!",
      });
    }
  }

  return (
    <div className="space-y-2">
      <div
        className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {link ? (
          <>
            <Image
              className="object-cover w-full h-full"
              src={link}
              alt="avatar"
              layout="fill"
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <Upload className="w-8 h-8 mb-2" />
            <span>No image</span>
          </div>
        )}
      </div>
      <label className="block">
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <span className="block w-full text-center border border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition duration-200">
          {link ? "Edit Image" : "Upload Image"}
        </span>
      </label>
    </div>
  );
}
