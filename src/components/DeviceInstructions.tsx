"use client";

import { useState, useEffect } from "react";
import { isIOS } from "@/lib/deviceDetection";

export function DeviceInstructions() {
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsIOSDevice(isIOS());
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full max-w-md mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
        How to share your promo
      </h3>

      {isIOSDevice ? (
        <div className="space-y-1.5">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 mr-2 text-xs font-medium">
              1
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Download the image using the download button
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 mr-2 text-xs font-medium">
              2
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Click the Share button
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 mr-2 text-xs font-medium">
              3
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Upload the downloaded image when prompted
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 mr-2 text-xs font-medium">
              1
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Click the Share button
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 mr-2 text-xs font-medium">
              2
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Authorize LinkedIn (first time only)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
