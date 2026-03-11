"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-24 w-24",
  lg: "h-64 w-full",
} as const;

const dimensionMap = {
  sm: { width: 40, height: 40 },
  md: { width: 96, height: 96 },
  lg: { width: 512, height: 256 },
} as const;

interface ItemImageProps {
  src?: string;
  alt: string;
  size: "sm" | "md" | "lg";
  className?: string;
}

export function ItemImage({ src, alt, size, className }: ItemImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-muted",
          sizeMap[size],
          className
        )}
      >
        <ImageIcon className={cn("text-muted-foreground", size === "sm" ? "h-5 w-5" : size === "md" ? "h-8 w-8" : "h-12 w-12")} />
      </div>
    );
  }

  const { width, height } = dimensionMap[size];

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      onError={() => setError(true)}
      className={cn("rounded-md object-cover", sizeMap[size], className)}
      priority={size === "lg"}
    />
  );
}
