"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface IOSShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (imageFile: File) => Promise<void>;
  text: string;
}

export function IOSShareModal({
  isOpen,
  onClose,
  onShare,
  text,
}: IOSShareModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState(text);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setShareText(text);
      setIsSharing(false);
    }
  }, [isOpen, text]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleShare = async () => {
    if (!selectedFile) {
      toast.error("Please select an image to share", {
        position: "bottom-center",
      });
      return;
    }

    try {
      setIsSharing(true);
      await onShare(selectedFile);
      onClose();
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share on LinkedIn. Please try again.", {
        position: "bottom-center",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Share to LinkedIn
        </h2>

        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-md p-3 mb-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Select the image</span> you just
                downloaded to share on LinkedIn
              </p>
            </div>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={triggerFileInput}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 mb-2 relative">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-blue-500 mt-1">Click to change</p>
              </div>
            ) : (
              <div className="py-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Click to select an image
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Post Text
          </label>
          <textarea
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={5}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={isSharing || !selectedFile}
            className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-[#0077b5] hover:bg-[#005e93] flex items-center ${
              isSharing || !selectedFile
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isSharing ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sharing...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
                Share on LinkedIn
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
