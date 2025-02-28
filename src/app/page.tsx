"use client";

import { useState, useEffect } from "react";
import PromoForm from "@/components/PromoForm";
import PromoImagePreview from "@/components/PromoImagePreview";
import type { FormData } from "@/components/PromoForm";

const initialFormData: FormData = {
	name: "",
	role: "",
	company: "",
	profileImage: null,
};

export default function Home() {
	const [formData, setFormData] = useState<FormData>(initialFormData);
	const [darkMode, setDarkMode] = useState(true);

	// Load form data and theme preference from local storage on initial load
	useEffect(() => {
		// Load form data
		const savedData = localStorage.getItem("promoFormData");
		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData);
				setFormData(parsedData);
			} catch (error) {
				console.error("Error parsing saved form data:", error);
			}
		}

		// Load theme preference
		const savedTheme = localStorage.getItem("darkMode");
		if (savedTheme !== null) {
			setDarkMode(savedTheme === "true");
		} else {
			// Check system preference if no saved preference
			const prefersDarkMode = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			setDarkMode(prefersDarkMode);
		}
	}, []);

	// Save form data to local storage when it changes
	useEffect(() => {
		localStorage.setItem("promoFormData", JSON.stringify(formData));
	}, [formData]);

	// Save theme preference when it changes
	useEffect(() => {
		localStorage.setItem("darkMode", darkMode.toString());
		// Apply dark mode class to document
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	const handleFormChange = (newData: FormData) => {
		setFormData(newData);
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	return (
		<div
			className={`min-h-screen py-6 sm:py-12 px-3 sm:px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-200`}
		>
			<div className="max-w-6xl mx-auto">
				<header className="relative">
					<div
						className={`absolute inset-0 ${darkMode ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30" : "bg-gradient-to-r from-blue-50 to-purple-50"} rounded-lg -z-10 blur-sm`}
					/>
					<div className="text-center py-4 sm:py-8 px-2 sm:px-4">
						<h1
							className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-200 tracking-tight`}
						>
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
								HSR Founders Club
							</span>
							<span
								className={`${darkMode ? "text-gray-100" : "text-gray-800"}`}
							>
								{" "}
								Promo Generator
							</span>
						</h1>
						<div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto my-2 sm:my-4 rounded-full" />
					</div>
				</header>

				<div
					className={`rounded-xl overflow-hidden shadow-2xl ${darkMode ? "bg-gray-800/50 ring-1 ring-gray-700" : "bg-white/90 ring-1 ring-gray-200"}`}
				>
					<div className="md:flex flex-col md:flex-row">
						{/* Form section */}
						<div className="md:w-2/5 p-4 sm:p-6 md:border-r md:border-gray-700">
							<PromoForm
								formData={formData}
								onChange={handleFormChange}
								darkMode={darkMode}
							/>
						</div>

						{/* Preview section */}
						<div className="p-4 sm:p-6 md:p-8 md:w-3/5 flex items-center justify-center">
							<PromoImagePreview formData={formData} darkMode={darkMode} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
