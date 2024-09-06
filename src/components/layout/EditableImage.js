import Image from "next/image";
import toast from "react-hot-toast";
export default function EditableImage({ link, setLink }) {
  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      const data = new FormData();
      data.set("file", files[0]);

      const uploadPromise = fetch("/api/upload", {
        method: "POST",
        body: data,
      }).then((respone) => {
        if (respone.ok) {
          return respone.json().then((link) => {
            setLink(link);
          });
        }
        throw new Error("Upload error");
      });

      await toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Image uploaded!",
        error: "Uplaod error!",
      });
    }
  }
  return (
    <>
      {link && (
        <Image
          className="rounded-lg w-full h-full"
          src={link}
          alt="avatar"
          width={250}
          height={250}
        />
      )}
      {!link && (
        <div className="bg-gray-200 text-center p-4 text-gray-500 rounded-lg">
          No image
        </div>
      )}
      <label>
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border border-gray-300 rounded-lg p-2 cursor-pointer">
          Edit
        </span>
      </label>
    </>
  );
}
