"use client";

import Image from "next/image";
import { useState } from "react";

export default function ElevatorProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0] || "");

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-neutral-100 text-sm text-neutral-500">
        Product images will be added soon.
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              aria-label={`Show ${productName} image ${index + 1}`}
              aria-pressed={activeImage === image}
              className={`relative aspect-square overflow-hidden border-2 ${
                activeImage === image ? "border-blue-600" : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
