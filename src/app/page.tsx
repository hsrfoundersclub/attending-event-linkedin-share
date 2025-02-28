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
			className={`min-h-screen py-12 px-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-200`}
		>
			<div className="max-w-6xl mx-auto">
				<header className="mb-10 text-center">
					<h1
						className={`text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-200`}
					>
						HSR Founders Club Promo Generator
					</h1>
					{/* <button
						type="button"
						onClick={toggleDarkMode}
						className="absolute right-4 top-0 p-2 rounded-full transition-colors duration-200"
						aria-label="Toggle dark mode"
					>
						{darkMode ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-yellow-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<title>Light mode</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-gray-700"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<title>Dark mode</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
								/>
							</svg>
						)}
					</button> */}
				</header>

				<div
					className={`rounded-xl overflow-hidden shadow-2xl ${darkMode ? "bg-gray-800/50 ring-1 ring-gray-700" : "bg-white/90 ring-1 ring-gray-200"}`}
				>
					<div className="md:flex">
						{/* Form section */}
						<div className="md:w-2/5 p-6 md:border-r md:border-gray-700">
							<PromoForm
								formData={formData}
								onChange={handleFormChange}
								darkMode={darkMode}
							/>
						</div>

						{/* Preview section */}
						<div className="p-6 md:p-8 md:w-3/5 flex items-center justify-center">
							<PromoImagePreview formData={formData} darkMode={darkMode} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
