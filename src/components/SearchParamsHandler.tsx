"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SearchParamsHandlerProps {
  onParamsLoaded: (params: {
    text: string | null;
    image: string | null;
  }) => void;
}

export default function SearchParamsHandler({
  onParamsLoaded,
}: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const restoredText = searchParams.get("text");
    const restoredImage = searchParams.get("image");

    if (restoredText || restoredImage) {
      onParamsLoaded({
        text: restoredText ? decodeURIComponent(restoredText) : null,
        image: restoredImage ? decodeURIComponent(restoredImage) : null,
      });
    }
  }, [searchParams, onParamsLoaded]);

  return null; // This component doesn't render anything
}
