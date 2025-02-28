"use client";

import { useState, useRef, type ChangeEvent } from "react";

export type FormData = {
	name: string;
	role: string;
	company: string;
	profileImage: string | null;
};

type PromoFormProps = {
	formData: FormData;
	onChange: (data: FormData) => void;
	darkMode: boolean;
};

export default function PromoForm({
	formData,
	onChange,
	darkMode,
}: PromoFormProps) {
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
		{},
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const newFormData = { ...formData, [name]: value };

		// Always update the form data first
		onChange(newFormData);

		// Then handle validation
		const newErrors = { ...errors };
		if (value.trim() === "") {
			newErrors[name as keyof FormData] =
				`${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
			setErrors(newErrors);
		} else {
			// Use object destructuring instead of delete
			const { [name as keyof FormData]: _, ...updatedErrors } = newErrors;
			setErrors(updatedErrors);
		}
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			setErrors({ ...errors, profileImage: "File must be an image" });
			return;
		}

		// Convert to base64
		const reader = new FileReader();
		reader.onload = (event) => {
			const newFormData = {
				...formData,
				profileImage: event.target?.result as string,
			};
			onChange(newFormData);
			// Clear error if any
			const { profileImage, ...updatedErrors } = errors;
			setErrors(updatedErrors);
		};
		reader.readAsDataURL(file);
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="w-full">
			<h2
				className={`text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 ${darkMode ? "text-gray-100" : "text-gray-800"} transition-colors duration-200`}
			>
				Your Information
			</h2>

			<div className="space-y-4 sm:space-y-5">
				<div>
					<label
						htmlFor="name"
						className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"} transition-colors duration-200`}
					>
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						value={formData.name}
						onChange={handleChange}
						className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
							errors.name
								? "border-red-500"
								: darkMode
									? "border-gray-600"
									: "border-gray-300"
						} ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} transition-colors duration-200`}
						placeholder="John Doe"
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-500">{errors.name}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="role"
						className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"} transition-colors duration-200`}
					>
						Role
					</label>
					<input
						id="role"
						name="role"
						type="text"
						value={formData.role}
						onChange={handleChange}
						className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
							errors.role
								? "border-red-500"
								: darkMode
									? "border-gray-600"
									: "border-gray-300"
						} ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} transition-colors duration-200`}
						placeholder="Software Engineer"
					/>
					{errors.role && (
						<p className="mt-1 text-sm text-red-500">{errors.role}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="company"
						className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"} transition-colors duration-200`}
					>
						Company
					</label>
					<input
						id="company"
						name="company"
						type="text"
						value={formData.company}
						onChange={handleChange}
						className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
							errors.company
								? "border-red-500"
								: darkMode
									? "border-gray-600"
									: "border-gray-300"
						} ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"} transition-colors duration-200`}
						placeholder="Acme Inc."
					/>
					{errors.company && (
						<p className="mt-1 text-sm text-red-500">{errors.company}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="profileImage"
						className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"} transition-colors duration-200`}
					>
						Profile Photo
					</label>
					<button
						type="button"
						onClick={triggerFileInput}
						aria-label="Upload profile photo"
						className={`mt-1 flex justify-center w-full px-4 sm:px-6 pt-3 sm:pt-5 pb-4 sm:pb-6 border-2 border-dashed rounded-md cursor-pointer ${
							errors.profileImage
								? "border-red-500"
								: darkMode
									? "border-gray-600"
									: "border-gray-300"
						} ${darkMode ? "bg-gray-700/50 hover:bg-gray-700/80" : "bg-white hover:bg-gray-50"} transition-colors duration-200`}
					>
						<div className="space-y-1 text-center">
							{formData.profileImage ? (
								<div className="flex flex-col items-center">
									<img
										src={formData.profileImage}
										alt="User profile"
										className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2"
									/>
									<p
										className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-200`}
									>
										Click to change
									</p>
								</div>
							) : (
								<>
									<svg
										className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 ${darkMode ? "text-gray-400" : "text-gray-400"} transition-colors duration-200`}
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
									<div
										className={`flex text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} transition-colors duration-200`}
									>
										<p className="pl-1">Click to upload a photo</p>
									</div>
									<p
										className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} transition-colors duration-200`}
									>
										PNG, JPG, GIF up to 10MB
									</p>
								</>
							)}
							<input
								id="profileImage"
								name="profileImage"
								type="file"
								ref={fileInputRef}
								onChange={handleImageChange}
								accept="image/*"
								className="sr-only"
							/>
						</div>
					</button>
					{errors.profileImage && (
						<p className="mt-1 text-sm text-red-500">{errors.profileImage}</p>
					)}
				</div>
			</div>
		</div>
	);
}
