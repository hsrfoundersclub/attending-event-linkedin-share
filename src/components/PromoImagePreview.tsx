"use client";

import { useRef } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import type { FormData } from "./PromoForm";

type PromoImagePreviewProps = {
	formData: FormData;
	darkMode: boolean;
};

export default function PromoImagePreview({
	formData,
	darkMode,
}: PromoImagePreviewProps) {
	const imageRef = useRef<HTMLDivElement>(null);
	const promoText =
		"Join me at HSR Founders Club PRODUCT WEEK 2025! March 3-6. It's going to be an amazing event with great speakers and networking opportunities. #HSRFC #ProductWeek2025";

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
			// Convert the HTML to a PNG
			const dataUrl = await toPng(imageRef.current, { quality: 0.95 });

			// Create a blob from the data URL
			const response = await fetch(dataUrl);
			const blob = await response.blob();

			// Copy image to clipboard
			const item = new ClipboardItem({ "image/png": blob });
			await navigator.clipboard.write([item]);

			// Show success message with toast
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
		<div className="flex flex-col items-center space-y-5 w-full">
			<div
				ref={imageRef}
				className="relative w-full max-w-md bg-black shadow-xl rounded-lg overflow-hidden"
				style={{
					aspectRatio: "1/1",
					maxHeight: "480px",
				}}
			>
				{/* Template Background */}
				<img
					src="/template.png"
					alt="Event template"
					className="absolute inset-0 w-full h-full object-cover"
				/>

				{/* Profile Photo */}
				{formData.profileImage && (
					<div
						className="absolute"
						style={{
							top: "157px",
							left: "247px",
							width: "117px",
							height: "117px",
						}}
					>
						<div className="w-full h-full overflow-hidden">
							<img
								src={formData.profileImage}
								alt="User avatar"
								className="w-full h-full object-contain"
							/>
						</div>
					</div>
				)}

				{/* Name */}
				{formData.name && (
					<div
						className="absolute text-center"
						style={{
							top: "292px",
							left: "68%",
							transform: "translateX(-50%)",
							width: "100%",
						}}
					>
						<h2
							className="text-white text-xl font-bold"
							style={{ fontSize: "16px" }}
						>
							{formData.name}
						</h2>
					</div>
				)}

				{/* Role */}
				{formData.role && (
					<div
						className="absolute text-center"
						style={{
							top: "311px",
							left: "68%",
							transform: "translateX(-50%)",
							width: "100%",
						}}
					>
						<p className="text-white" style={{ fontSize: "12px" }}>
							{formData.role}
						</p>
					</div>
				)}

				{/* Company */}
				{formData.company && (
					<div
						className="absolute text-center"
						style={{
							top: "328px",
							left: "68%",
							transform: "translateX(-50%)",
							width: "100%",
						}}
					>
						<p className="text-white" style={{ fontSize: "12px" }}>
							{formData.company}
						</p>
					</div>
				)}
			</div>

			<div
				className={`w-full max-w-md p-4 rounded-lg ${darkMode ? "bg-gray-800/70" : "bg-gray-100"} transition-colors duration-200`}
			>
				<div
					className={`prose prose-sm ${darkMode ? "prose-invert" : ""} max-w-none mb-3`}
				>
					<p>
						Join me at HSR Founders Club PRODUCT WEEK 2025! March 3-6. It&apos;s
						going to be an amazing event with great speakers and networking
						opportunities. #HSRFC #ProductWeek2025
					</p>
				</div>
				<div className="flex justify-center space-x-4">
					<button
						type="button"
						onClick={copyTextToClipboard}
						className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-md cursor-pointer"
					>
						<svg
							className="w-4 h-4 mr-2"
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
					<button
						type="button"
						onClick={copyImageToClipboard}
						className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center shadow-md cursor-pointer"
					>
						<svg
							className="w-4 h-4 mr-2"
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
				</div>
			</div>
		</div>
	);
}
