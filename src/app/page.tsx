"use client";

import dynamic from "next/dynamic";

// Dynamically import the HomePage component with SSR disabled
const HomePage = dynamic(() => import("@/components/HomePage"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-xl">Loading...</div>
    </div>
  ),
});

export default function Home() {
  return <HomePage />;
}
