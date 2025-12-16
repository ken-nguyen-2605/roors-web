// components/reservation/ReservationForm.tsx
"use client";
import { useState, useEffect } from "react";
import { Cinzel } from "next/font/google";
import { ReservationDetails } from "@/types/reservation";

const cinzel = Cinzel({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

interface Props {
	details: Pick<ReservationDetails, "name" | "email" | "phone" | "guests">;
	onChange: (
		field: keyof ReservationDetails,
		value: string | number
	) => void;
}

export default function ReservationForm({ details, onChange }: Props) {
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;
		const parsedValue = type === "number" ? parseInt(value, 10) || 1 : value;
		onChange(name as keyof ReservationDetails, parsedValue);
	};

	// Basic validation for visual feedback
	useEffect(() => {
		const newErrors: Record<string, string> = {};
		if (details.name && details.name.trim().length < 2)
			newErrors.name = "Name seems too short.";
		if (details.email && !/\S+@\S+\.\S+/.test(details.email))
			newErrors.email = "Invalid email format.";
		if (details.phone && !/^\+?\d{7,15}$/.test(details.phone))
			newErrors.phone = "Invalid phone number.";
		setErrors(newErrors);
	}, [details]);

	return (
		<form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-6">
			<h3
				className={`${cinzel.className} font-bold text-3xl text-center mb-4 text-[#7A7A76]`}
			>
				Reservation Details
			</h3>

			{/* Name Input */}
			<label className="flex flex-col text-sm font-semibold text-[#7A7A76]">
				<span className="mb-2 ml-1">Name</span>
				<input
					name="name"
					value={details.name}
					onChange={handleChange}
					className="border-2 border-[#989793] rounded-lg p-3 focus:border-[#7A7A76] focus:outline-none focus:ring-2 focus:ring-[#7A7A76]/20 transition-all placeholder:text-gray-400"
					placeholder="Jane Doe"
				/>
				{errors.name && (
					<span className="text-red-600 text-xs mt-1 ml-1 font-normal">
						{errors.name}
					</span>
				)}
			</label>

			{/* Email Input */}
			<label className="flex flex-col text-sm font-semibold text-[#7A7A76]">
				<span className="mb-2 ml-1">Email</span>
				<input
					type="email"
					name="email"
					value={details.email}
					onChange={handleChange}
					className="border-2 border-[#989793] rounded-lg p-3 focus:border-[#7A7A76] focus:outline-none focus:ring-2 focus:ring-[#7A7A76]/20 transition-all placeholder:text-gray-400"
					placeholder="jane@example.com"
				/>
				{errors.email && (
					<span className="text-red-600 text-xs mt-1 ml-1 font-normal">
						{errors.email}
					</span>
				)}
			</label>

			{/* Phone Input */}
			<label className="flex flex-col text-sm font-semibold text-[#7A7A76]">
				<span className="mb-2 ml-1">Phone</span>
				<input
					type="tel"
					name="phone"
					value={details.phone}
					onChange={handleChange}
					className="border-2 border-[#989793] rounded-lg p-3 focus:border-[#7A7A76] focus:outline-none focus:ring-2 focus:ring-[#7A7A76]/20 transition-all placeholder:text-gray-400"
					placeholder="+1234567890"
				/>
				{errors.phone && (
					<span className="text-red-600 text-xs mt-1 ml-1 font-normal">
						{errors.phone}
					</span>
				)}
			</label>

			{/* Guests Input */}
			<label className="flex flex-col text-sm font-semibold text-[#7A7A76]">
				<span className="mb-2 ml-1">Number of Guests</span>
				<input
					type="number"
					name="guests"
					value={details.guests}
					onChange={handleChange}
					min={1}
					max={10} // Max seats for largest regular table
					className="border-2 border-[#989793] rounded-lg p-3 focus:border-[#7A7A76] focus:outline-none focus:ring-2 focus:ring-[#7A7A76]/20 transition-all placeholder:text-gray-400"
				/>
			</label>
		</form>
	);
}