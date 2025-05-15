"use client";
import { useState, useRef, useCallback } from "react";
import { MdEdit, MdClose, MdUpload } from "react-icons/md";
import Image from "next/image";

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (file: File | null) => void;
}

export default function ImageUpload({ initialImage, onImageChange }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (any image format)
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, GIF, etc.)");
      return;
    }

    // Validate file size (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      onImageChange(file);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      onImageChange(null);
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onImageChange]);

  const handleUploadClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`relative h-16 w-16 rounded-md overflow-hidden ${selectedImage && "border-none"} border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all cursor-pointer`}
        onClick={handleUploadClick}
      >
        {selectedImage ? (
          <>
            <Image
              src={selectedImage}
              alt="Uploaded preview"
              fill
              className="object-cover"
              sizes="100px"
              priority={!!initialImage}
            />
            <div className={`absolute inset-0 hover:bg-black/15 flex items-center justify-center transition-opacity `}>
              <MdEdit className={`text-white text-xl ${isHovered ? "opacity-80" : "opacity-0"}`} />
            </div>
          </>
        ) : (
          <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center gap-1 text-gray-500">
            <MdUpload className="text-2xl" />
            <span className="text-xs">Upload</span>
          </div>
        )}
      </div>
      
      {selectedImage && (
        <button
          onClick={handleDelete}
          className="absolute -top-3 -right-3 bg-red-500/5 text-white rounded-full p-0.5 hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Remove image"
          type="button"
        >
          <MdClose size={16} />
        </button>
      )}
      
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
        aria-label="Image upload"
      />
    </div>
  );
}