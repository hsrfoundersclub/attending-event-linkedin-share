"use client";

import { useRef } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { copyImageToClipboard as copyImageToClipboardLib } from "copy-image-clipboard";
import type { FormData } from "./PromoForm";
import { LinkedInShareButton } from "./LinkedInShareButton";

type PromoImagePreviewProps = {
  formData: FormData;
  darkMode: boolean;
};

export default function PromoImagePreview({
  formData,
  darkMode,
}: PromoImagePreviewProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const imgsrcRef = useRef<HTMLImageElement>(null);
  const promoText =
    "The AFTERPARTY is calling! 🚀\n\nJoin me at HSR Founders Club - THE AFTERPARTY this April 26th.\n\nAn evening packed with bold ideas, brilliant founders, and non-stop energy. Come for the vibe, stay for the connections. 🔥\n\n#HSRFC #THEAFTERPARTY2025";

  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promoText);
      toast.success("Text copied to clipboard!", {
        position: "bottom-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error copying text:", error);
      toast.error("Failed to copy text. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  const copyImageToClipboard = async () => {
    if (!imageRef.current) return;

    try {
      // Create the promise for image conversion first (fixing ios safari bug)
      const makeImagePromise = async () => {
        const buildPng = async () => {
          if (!imageRef.current)
            throw new Error("Image element is not available");
          const element = document.getElementById("image-node");

          let dataUrl = "";
          const minDataLength = 2000000;
          let i = 0;
          const maxAttempts = 10;

          while (dataUrl.length < minDataLength && i < maxAttempts) {
            dataUrl = await toPng(imageRef.current, {
              quality: 1.0,
              pixelRatio: 2,
              cacheBust: true,
            });
            i += 1;
          }

          return dataUrl;
        };

        const dataUrl = await buildPng();

        const response = await fetch(dataUrl);
        return await response.blob();
      };

      // Create ClipboardItem with the promise
      const clipboardItem = new ClipboardItem({
        "image/png": makeImagePromise(),
      });

      // Perform clipboard operation
      await navigator.clipboard.write([clipboardItem]);
      toast.success("Image copied to clipboard!", {
        position: "bottom-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error copying image:", error);
      toast.error("Failed to copy image. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-5 w-full">
      <div
        ref={imageRef}
        className="relative w-full max-w-md bg-black shadow-xl rounded-lg overflow-hidden"
        style={{
          aspectRatio: "3/4",
          maxHeight: "640px",
        }}
      >
        {/* Template Background */}
        <img
          ref={imgsrcRef}
          src="/template.png"
          alt="Event template"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="absolute drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] flex flex-col justify-center items-center rotate-6 p-2"
          style={{
            top: "21.7%",
            left: "44.7%",
            width: "48.5%",
            height:
              "40%" /* Adjusted to ensure content fits within boundaries */,
            overflow: "hidden" /* Added to prevent content from overflowing */,
          }}
        >
          {/* Image container - takes up most of the height but not all */}
          <div className="w-[55%] h-[55%] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] rounded-md overflow-hidden mb-2">
            {/* Profile Photo */}
            {formData.profileImage && (
              <img
                src={formData.profileImage}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Text container - aligned at the bottom */}
          <div className="flex flex-col justify-start items-center w-full rounded-2">
            {/* Name */}
            {formData.name && (
              <p className="text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-bold text-[0.75rem] sm:text-[1rem] text-center truncate w-full px-1">
                {formData.name}
              </p>
            )}

            {/* Role, Company */}
            <p className="text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-[0.65rem] sm:text-[0.9rem] text-center truncate w-full px-1">
              {formData.role ? formData.role : ""}
              {formData.company ? ", " + formData.company : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Copy buttons - moved here between image and text block */}
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 w-full max-w-md">
        <button
          type="button"
          onClick={copyImageToClipboard}
          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center shadow-md cursor-pointer text-[0.875rem]"
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Copy Image
        </button>
        <button
          type="button"
          onClick={copyTextToClipboard}
          className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center shadow-md cursor-pointer text-[0.875rem]"
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Copy Text
        </button>
      </div>

      <div
        className={`w-full max-w-md p-3 sm:p-4 rounded-lg ${
          darkMode ? "bg-gray-800/70" : "bg-gray-100"
        } transition-colors duration-200`}
      >
        <div
          className={`prose prose-sm ${
            darkMode ? "prose-invert" : ""
          } max-w-none`}
        >
          <p className="text-[0.875rem]">
            The AFTERPARTY is calling! 🚀
            <br />
            <br />
            Join me at HSR Founders Club - THE AFTERPARTY this April 26th.
            <br />
            <br />
            An evening packed with bold ideas, brilliant founders, and non-stop
            energy. Come for the vibe, stay for the connections. 🔥
            <br />
            <br />
            #HSRFC #THEAFTERPARTY2025
          </p>
        </div>
      </div>
      {/* LinkedIn Share Button */}
      <div className="flex justify-center w-full max-w-md">
        <LinkedInShareButton
          text={promoText}
          imageRef={imageRef as React.RefObject<HTMLDivElement>}
        />
      </div>
    </div>
  );
}
