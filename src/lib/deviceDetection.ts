/**
 * Utility functions for device detection
 */

/**
 * Detects if the current device is running iOS
 * @returns boolean indicating if the device is running iOS
 */
export function isIOS(): boolean {
  if (typeof window === "undefined") {
    return false; // Server-side rendering
  }

  const userAgent = window.navigator.userAgent.toLowerCase();

  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    // Detect iOS 13+ using MacOS + touch capability
    (/macintosh/.test(userAgent) && navigator.maxTouchPoints > 1)
  );
}
