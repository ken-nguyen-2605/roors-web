// pages/reservations.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Cinzel } from "next/font/google";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import ReservationForm from "@/components/reservation/ReservationForm";
import DateSelector from "@/components/reservation/DateSelector";
import TimeSelector from "@/components/reservation/TimeSelector";
import RestaurantMap from "@/components/reservation/RestaurantMap";
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";

import { ReservationDetails } from "@/types/reservation";
import tableService from "@/services/tableService";
import reservationService from "@/services/reservationService";
import { floorLayouts } from "@/data/floorLayouts";
import { motion } from "framer-motion";

const cinzel = Cinzel({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

// Helper function to get required table capacity based on guest count
const getTableCapacityForGuests = (guests: number): number => {
	if (guests <= 2) return 2;
	if (guests <= 4) return 4;
	if (guests <= 8) return 8;
	return 10;
};

export default function ReservationsPage() {
	const router = useRouter();

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

	// Store the API table ID mapping (UI table ID -> API table ID)
	const [tableIdMapping, setTableIdMapping] = useState<Map<string, number>>(
		new Map()
	);

	// State to hold the availability of tables from the API
	const [availability, setAvailability] = useState<{
		bookedTables: string[];
		notEnoughSpaceTables: string[];
	}>({ bookedTables: [], notEnoughSpaceTables: [] });

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [confirmation, setConfirmation] = useState<{
		name: string;
		guests: number;
		date: string;
		time: string;
		email: string;
	} | null>(null);

	// This effect runs whenever date, time, or guest count changes
	useEffect(() => {
		const getAvailability = async () => {
			setIsLoading(true);
			setError(null);
			
			

			try {
				// Format time to HH:mm:ss format required by API
				const formattedTime =
					reservation.time.length === 5
						? `${reservation.time}:00`
						: reservation.time;

				console.log("Fetching availability for:", {
					date: reservation.date,
					time: formattedTime,
					guests: reservation.guests,
				});
				
				// Call the API to get available tables
				const availableTables = await tableService.getAvailableDiningTables(
					reservation.date,
					formattedTime,
					reservation.guests
				);

				console.log("API Response - Available Tables:", availableTables);

				// Build a mapping between floor layout table IDs and API table IDs
				const mapping = new Map<string, number>();

				// Determine which tables are unavailable
				const bookedTables: string[] = [];
				const notEnoughSpaceTables: string[] = [];

				// Required capacity for the selected number of guests
				const requiredCapacity = getTableCapacityForGuests(reservation.guests);

				console.log(`Guest count: ${reservation.guests}, Required capacity: ${requiredCapacity}`);

				// Iterate through all UI tables in floor layouts
				Object.values(floorLayouts).forEach((floor) => {
					floor.tables.forEach((table) => {
						// Check if table has the exact capacity we need
						if (table.seats !== requiredCapacity) {
							// Table doesn't have the right capacity for guest count
							notEnoughSpaceTables.push(table.id);
							console.log(`Table ${table.tableNumber}: Wrong capacity (${table.seats} vs ${requiredCapacity})`);
						} else {
							// Table has right capacity, check if it's available from API
							const apiTable = availableTables.find(
								(at: any) => at.name === table.tableNumber
							);

							if (apiTable) {
								// Table is available
								mapping.set(table.id, apiTable.id);
								console.log(`Table ${table.tableNumber}: AVAILABLE (API ID: ${apiTable.id})`);
							} else {
								// Table is booked
								bookedTables.push(table.id);
								console.log(`Table ${table.tableNumber}: BOOKED`);
							}
						}
					});
				});

				// Update the mapping state
				setTableIdMapping(mapping);

				console.log("Final Status:");
				console.log("- Booked tables:", bookedTables);
				console.log("- Wrong capacity tables:", notEnoughSpaceTables);
				console.log("- Available tables:", Array.from(mapping.keys()));

				setAvailability({
					bookedTables,
					notEnoughSpaceTables,
				});

				// If the currently selected table becomes unavailable, deselect it
				if (
					reservation.tableId &&
					(bookedTables.includes(reservation.tableId) ||
						notEnoughSpaceTables.includes(reservation.tableId))
				) {
					handleValueChange("tableId", null);
				}
			} catch (err: any) {
				console.error("Error fetching table availability:", err);
				const errorMsg =
					err.message || "Failed to fetch table availability";
				setError(errorMsg);
				
				// Set all tables as unavailable on error to be safe
				const allTableIds: string[] = [];
				Object.values(floorLayouts).forEach((floor) => {
					floor.tables.forEach((table) => {
						allTableIds.push(table.id);
					});
				});
				setAvailability({
					bookedTables: allTableIds,
					notEnoughSpaceTables: [],
				});
			} finally {
				setIsLoading(false);
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
			reservation.name.trim() !== "" &&
			reservation.email.trim() !== "" &&
			reservation.phone.trim() !== "" &&
			reservation.tableId !== null
		);
	}, [reservation]);

	const handleSubmit = async () => {
		if (!isSubmittable) {
			alert("Please fill in all details and select a table.");
			return;
		}

		setIsSubmitting(true);
		setError(null);
		setConfirmation(null);

		try {
			// Format time to HH:mm:ss format required by API
			const formattedTime =
				reservation.time.length === 5
					? `${reservation.time}:00`
					: reservation.time;

			// Get the API table ID from our mapping
			const apiTableId = tableIdMapping.get(
				reservation.tableId as string
			);

			if (!apiTableId) {
				throw new Error(
					"Invalid table selection. Please select a table again."
				);
			}

			// Validate reservation time
			const timeValidation = reservationService.isValidReservationTime(
				reservation.date,
				formattedTime
			);

			if (!timeValidation.valid) {
				throw new Error(timeValidation.message);
			}

			// Prepare reservation data according to API requirements
			const dateTimeString = `${reservation.date}T${formattedTime}`;
			const phoneNumber = reservation.phone;

			const reservationData = {
				diningTableId: apiTableId, 

				// FE 'reservation.guests' -> BE 'numberOfGuests'
				numberOfGuests: reservation.guests,

				// FE (date + time) -> BE 'reservationDateTime'
				reservationDateTime: dateTimeString,

				// This field is required by your DTO
				phone: phoneNumber
			};

			console.log("Submitting reservation:", reservationData);

			// Call the API to create the reservation
			const result = await reservationService.createReservation(reservationData);

			if (!result.success) {
				throw new Error(result.message);
			}

			console.log("Reservation created successfully:", result.data);

			// Store confirmation details for UI display
			setConfirmation({
				name: reservation.name,
				guests: reservation.guests,
				date: reservation.date,
				time: reservation.time,
				email: reservation.email,
			});

			// Show success message
			// alert(
			// 	`Reservation confirmed!\n\nDetails:\n- Name: ${reservation.name}\n- Guests: ${reservation.guests}\n- Date: ${reservation.date}\n- Time: ${reservation.time}\n\nConfirmation sent to ${reservation.email}`
			// );

			// Redirect to my reservations page after successful submission
			// setTimeout(() => {
			// 	router.push("/my_reservation");
			// }, 2000);
		} catch (err: any) {
			console.error("Error creating reservation:", err);
			const errorMessage =
				err.message ||
				"Failed to create reservation. Please try again.";
			setError(errorMessage);
			alert(`Error: ${errorMessage}`);
		} finally {
			setIsSubmitting(false);
		}
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
					{isLoading ? (
						<div className="text-center py-12">
							<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
							<p className="mt-4 text-gray-600">
								Loading table availability...
							</p>
						</div>
					) : (
						<>
							<RestaurantMap
								selectedTableId={reservation.tableId}
								onTableSelect={(tableId) =>
									handleValueChange("tableId", tableId)
								}
								bookedTables={availability.bookedTables}
								notEnoughSpaceTables={
									availability.notEnoughSpaceTables
								}
								isLoading={isLoading}
							/>
							
							{/* Availability Summary
							<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<h3 className="font-semibold text-blue-900 mb-2">
									Table Availability Info
								</h3>
								<div className="text-sm text-blue-800 space-y-1">
									<p>
										• Required capacity for {reservation.guests} guests: {getTableCapacityForGuests(reservation.guests)} seats
									</p>
									<p>
										• Available tables: {Array.from(tableIdMapping.keys()).length}
									</p>
									<p>
										• Booked tables: {availability.bookedTables.length}
									</p>
									<p>
										• Wrong capacity: {availability.notEnoughSpaceTables.length}
									</p>
								</div>
							</div> */}
						</>
					)}

					{/* Error Message */}
					{error && (
						<div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
							<p className="font-semibold">Error:</p>
							<p>{error}</p>
						</div>
					)}

					{/* Confirmation Banner */}
					{confirmation && (
						<motion.div
							className="mt-10 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-6 py-5 shadow-md"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
						>
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700 mb-1">
								Reservation Confirmed
							</p>
							<h3
								className={`${cinzel.className} text-2xl font-semibold text-gray-900 mb-3`}
							>
								Thank you, {confirmation.name}.
							</h3>
							<p className="text-sm text-gray-700 mb-1">
								We&apos;re expecting{" "}
								<span className="font-semibold">
									{confirmation.guests}{" "}
									{confirmation.guests === 1
										? "guest"
										: "guests"}
								</span>{" "}
								on{" "}
								<span className="font-semibold">
									{confirmation.date}
								</span>{" "}
								at{" "}
								<span className="font-semibold">
									{confirmation.time}
								</span>
								.
							</p>
							<p className="text-sm text-gray-700">
								A confirmation has been sent to{" "}
								<span className="font-mono text-amber-800">
									{confirmation.email}
								</span>
							</p>
						</motion.div>
					)}

					{/* Section 4: Final Confirmation Button */}
					<div className="mt-12 flex justify-center">
						<motion.button
							onClick={handleSubmit}
							disabled={!isSubmittable || isSubmitting}
							className="bg-gradient-to-r from-amber-700 to-amber-800 text-white px-12 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
							whileHover={{
								scale:
									isSubmittable && !isSubmitting ? 1.05 : 1,
							}}
							whileTap={{
								scale:
									isSubmittable && !isSubmitting ? 0.95 : 1,
							}}
						>
							{isSubmitting
								? "Submitting..."
								: "Confirm Reservation"}
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