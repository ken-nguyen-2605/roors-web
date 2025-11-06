// pages/reservations.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Cinzel } from "next/font/google";
import dayjs from "dayjs";

import ReservationForm from "@/components/reservation/ReservationForm";
import DateSelector from "@/components/reservation/DateSelector";
import TimeSelector from "@/components/reservation/TimeSelector";
import RestaurantMap from "@/components/reservation/RestaurantMap";
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";

import { ReservationDetails } from "@/types/reservation";
import { fetchTableAvailability } from "@/lib/availabilityAPI";
import { motion } from "framer-motion";

const cinzel = Cinzel({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

export default function ReservationsPage() {
	// Centralized state for the entire reservation form
	const [reservation, setReservation] = useState<ReservationDetails>({
		name: "",
		email: "",
		phone: "",
		guests: 2,
		date: dayjs().format("YYYY-MM-DD"),
		time: "18:00",
		tableId: null,
	});

	// State to hold the availability of tables from the mock API
	const [availability, setAvailability] = useState<{
		bookedTables: string[];
		notEnoughSpaceTables: string[];
	}>({ bookedTables: [], notEnoughSpaceTables: [] });

	const [isLoading, setIsLoading] = useState(true);

	// This effect runs whenever date, time, or guest count changes
	useEffect(() => {
		const getAvailability = async () => {
			setIsLoading(true);
			const result = await fetchTableAvailability({
				date: reservation.date,
				time: reservation.time,
				guests: reservation.guests,
			});
			setAvailability(result);
			setIsLoading(false);

			// If the currently selected table becomes unavailable, deselect it
			if (
				reservation.tableId &&
				(result.bookedTables.includes(reservation.tableId) ||
					result.notEnoughSpaceTables.includes(reservation.tableId))
			) {
				handleValueChange("tableId", null);
			}
		};

		getAvailability();
	}, [reservation.date, reservation.time, reservation.guests]);

	// Generic handler to update any part of the reservation state
	const handleValueChange = (
		field: keyof ReservationDetails,
		value: string | number | null
	) => {
		setReservation((prev) => ({ ...prev, [field]: value }));
	};

	// Derived state to check if the form is ready for submission
	const isSubmittable = useMemo(() => {
		return (
			reservation.name &&
			reservation.email &&
			reservation.phone &&
			reservation.tableId
		);
	}, [reservation]);

	const handleSubmit = () => {
		if (!isSubmittable) {
			alert("Please fill in all details and select a table.");
			return;
		}
		alert(
			`Reservation confirmed for ${reservation.name} (${reservation.guests} guests) on ${reservation.date} at ${reservation.time} for table ${reservation.tableId}. Confirmation sent to ${reservation.email}.`
		);
		console.log("Submitting reservation:", reservation);
		// Here you would typically send the data to your backend API
	};

	return (
		<section className="relative min-h-screen bg-[#F5F4ED]">
			{/* Decorative Background */}
			<div className="absolute top-0 w-full h-[400px] overflow-hidden">
				<Image
					src="/background/bg1.jpg"
					alt="Background"
					fill
					className="object-cover brightness-[0.3]"
					priority
				/>
			</div>

			<div className="relative z-10 flex flex-col items-center px-4 pt-36 pb-16">
				{/* Header */}
				<div
					className="text-center mb-16"
					data-aos="fade-down"
					data-aos-duration="650"
				>
					<h1
						className={`${cinzel.className} text-6xl md:text-7xl text-white mb-4 font-semibold tracking-wide`}
					>
						Make a Reservation
					</h1>
					<p className="text-white/90 text-lg font-light tracking-wider">
						Select your preferred date and time
					</p>
				</div>

				{/* Decorative Line */}
				<div
					className="flex items-center justify-between w-full max-w-[900px] mb-12"
					data-aos="fade-up"
					data-aos-delay="100"
					data-aos-duration="650"
				>
					<Line
						color="white"
						size={350}
						direction="horizontal"
						thinkness={2}
					/>
					<Star color="white" size={48} />
					<Line
						color="white"
						size={350}
						direction="horizontal"
						thinkness={2}
					/>
				</div>

				{/* Main Content Card */}
				<div
					className="w-full max-w-8xl bg-white rounded-[20px] shadow-2xl p-8 md:p-12"
					data-aos="fade-up"
					data-aos-delay="200"
					data-aos-duration="650"
				>
					{/* Section 1: User Details & Image */}
					<div className="grid md:grid-cols-2 gap-10 mb-6">
						<ReservationForm
							details={reservation}
							onChange={handleValueChange}
						/>
						<Image
							src="/image/reservedTable.jpg"
							alt="Reservation Decoration"
							width={550}
							height={200}
							className="hidden md:block self-center justify-self-center rounded-lg"
						/>
					</div>

					{/* Section 2: Date & Time Selection */}
					<div className="mb-8">
						<h2
							className={`${cinzel.className} text-3xl text-center mb-4 text-[#7A7A76] font-bold`}
						>
							Select Date, Time & Table
						</h2>
						<DateSelector
							selectedDate={reservation.date}
							onSelect={(date) => handleValueChange("date", date)}
						/>
						<div className="my-2 h-[2px] bg-gradient-to-r from-transparent via-[#989793] to-transparent"></div>
						<TimeSelector
							selectedTime={reservation.time}
							onSelect={(time) => handleValueChange("time", time)}
						/>
					</div>

					{/* Section 3: Table Map */}
					<RestaurantMap
						selectedTableId={reservation.tableId}
						onTableSelect={(tableId) =>
							handleValueChange("tableId", tableId)
						}
						bookedTables={availability.bookedTables}
						notEnoughSpaceTables={availability.notEnoughSpaceTables}
						isLoading={isLoading}
					/>

					{/* Section 4: Final Confirmation Button */}
					<div className="mt-12 flex justify-center">
						<motion.button
							onClick={handleSubmit}
							disabled={!isSubmittable}
							className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-12 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
							whileHover={{ scale: isSubmittable ? 1.05 : 1 }}
							whileTap={{ scale: isSubmittable ? 0.95 : 1 }}
						>
							Confirm Reservation
						</motion.button>
					</div>
				</div>

				{/* Bottom Decorative Element */}
				<div
					className="flex items-center justify-between w-full max-w-[900px] mt-16"
					data-aos="fade-up"
					data-aos-delay="300"
					data-aos-duration="650"
				>
					<Line
						color="#7A7A76"
						size={350}
						direction="horizontal"
						thinkness={2}
					/>
					<Star color="#7A7A76" size={48} />
					<Line
						color="#7A7A76"
						size={350}
						direction="horizontal"
						thinkness={2}
					/>
				</div>
			</div>
		</section>
	);
}