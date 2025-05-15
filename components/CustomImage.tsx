import React, { useState } from "react";
import Image from "next/image";
import defaultImg from "@/public/1.jpg";

const CustomImage = ({
  src,
  alt,
  ...props
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  const [imageSrc, setImageSrc] = useState(src || defaultImg.src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      {...props}
      // layout="fill"
      // objectFit="cover"
      loading="lazy"
      onError={() => setImageSrc(defaultImg.src)} // Show default image on error
      className={`${props.className || ""}`} // Ensure consistent image size
    />
  );
};

export default CustomImage;
