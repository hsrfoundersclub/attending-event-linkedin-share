"use client";

import { useRef, useState, useEffect } from "react";
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
  const defaultPromoText =
    "The AFTERPARTY is calling! 🚀\n\nJoin me at HSR Founders Club - THE AFTERPARTY this April 26th.\n\nAn evening packed with bold ideas, brilliant founders, and non-stop energy. Come for the vibe, stay for the connections. 🔥\n\nRegister here! https://lu.ma/xvq0kyrc \n\n#HSRFC #THEAFTERPARTY2025";

  const [promoText, setPromoText] = useState(defaultPromoText);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [templateError, setTemplateError] = useState(false);

  // Initialize the contentEditable div with the default text only once
  useEffect(() => {
    if (contentEditableRef.current) {
      contentEditableRef.current.innerHTML = defaultPromoText.replace(
        /\n/g,
        "<br>"
      );
    }
  }, [defaultPromoText]);

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
      // Generate the image data URL
      const dataUrl = await toPng(imageRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      // Try using the library first (which has better iOS support)
      try {
        await copyImageToClipboardLib(dataUrl);
        toast.success("Image copied to clipboard!", {
          position: "bottom-center",
          duration: 3000,
        });
        return;
      } catch (libError) {
        console.log(
          "Library method failed, trying native clipboard API",
          libError
        );
      }

      // Fallback to native clipboard API
      const blob = await (await fetch(dataUrl)).blob();
      const clipboardItem = new ClipboardItem({
        [blob.type]: blob,
      });
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

        {/* LinkedIn Share Button */}

        <LinkedInShareButton
          text={promoText}
          imageRef={imageRef as React.RefObject<HTMLDivElement>}
        />
      </div>

      <div
        ref={imageRef}
        className="relative w-full max-w-sm bg-black shadow-xl rounded-lg overflow-hidden"
        style={{
          aspectRatio: "3/4",
          maxHeight: "640px",
        }}
      >
        {/* Template Background */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/template.png"
            alt="Event template"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            style={{ objectFit: "cover" }}
            onLoad={() => setTemplateLoaded(true)}
            onError={() => setTemplateError(true)}
          />

          {templateError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-sm p-4 text-center">
              Unable to load template image. Please refresh the page.
            </div>
          )}
        </div>

        {templateLoaded && (
          <div
            className="absolute drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] flex flex-col justify-center items-center rotate-6 p-2"
            style={{
              top: "21.7%",
              left: "44.7%",
              width: "48.5%",
              height: "40%",
              overflow: "hidden",
              zIndex: 10 /* Ensure this is above the template image */,
            }}
          >
            {/* Image container - takes up most of the height but not all */}
            <div className="w-[55%] h-[55%] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] rounded-md overflow-hidden mb-2 relative">
              {/* Profile Photo */}
              {formData.profileImage && (
                <div className="w-full h-full relative">
                  <img
                    src={formData.profileImage}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                    style={{ display: "block" }}
                  />
                </div>
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
              <p className="text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-[0.60rem] sm:text-[0.85rem] text-center truncate w-full px-1">
                {formData.role ? formData.role : ""}
              </p>

              {/* Role, Company */}
              <p className="text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-[0.60rem] sm:text-[0.85rem] text-center truncate w-full px-1">
                {formData.company ? formData.company : ""}
              </p>
            </div>
          </div>
        )}
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
          <div
            ref={contentEditableRef}
            className="text-[0.875rem] outline-none"
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={(e) => {
              // Get the text content with preserved line breaks
              const content = e.currentTarget.innerText;
              setPromoText(content);
            }}
          />
        </div>
      </div>
    </div>
  );
}
