"use client";

import { useState } from "react";
import SlideBackground from "@/utils/SlideBackground";
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import Image from "next/image";
import { Inria_Serif, Italiana } from "next/font/google";

const inriaSerif = Inria_Serif({
	weight: ["300"],
	subsets: ["latin"],
});

const italiana = Italiana({
	weight: ["400"],
	subsets: ["latin"],
});

interface Reservation {
	id: number;
	date: string;
	time: string;
	guests: number;
	status: "upcoming" | "completed" | "cancelled";
	table: string;
}

const reservations: Reservation[] = [
	{
		id: 1,
		date: "2025-02-15",
		time: "19:00",
		guests: 4,
		status: "upcoming",
		table: "Table 12",
	},
	{
		id: 2,
		date: "2025-01-20",
		time: "18:30",
		guests: 2,
		status: "completed",
		table: "Table 5",
	},
	{
		id: 3,
		date: "2025-01-10",
		time: "20:00",
		guests: 6,
		status: "completed",
		table: "Table 8",
	},
	{
		id: 4,
		date: "2024-12-25",
		time: "19:30",
		guests: 3,
		status: "cancelled",
		table: "Table 3",
	},
	{
		id: 5,
		date: "2025-03-01",
		time: "18:00",
		guests: 2,
		status: "upcoming",
		table: "Table 7",
	},
	{
		id: 6,
		date: "2024-12-20",
		time: "20:30",
		guests: 5,
		status: "completed",
		table: "Table 15",
	},
];

const statusColors = {
	upcoming: "#4CAF50",
	completed: "#989793",
	cancelled: "#D32F2F",
};

const cardColors = ["#F5F4ED", "#FFFFFF", "#7A7A76", "#989793"];

type FilterType = "all" | "upcoming" | "completed" | "cancelled";

export default function ReservationHistory() {
	const [activeFilter, setActiveFilter] = useState<FilterType>("all");

	// Filter reservations based on active filter
	const filteredReservations =
		activeFilter === "all"
			? reservations
			: reservations.filter((res) => res.status === activeFilter);

	return (
		<section className="relative">
			{/* Background decorations */}
			<div className="absolute top-[800px] w-full flex justify-center">
				<Image
					src="/background/Group 12.png"
					alt="Decorative shape"
					width={2000}
					height={2000}
					className="w-full h-[1429px]"
				/>
			</div>

			{/* Hero Section */}
			<SlideBackground
				images={[
					"/background/bg1.jpg",
					"/background/bg3.jpg",
					"/background/bg2.jpg",
				]}
				interval={8000}
				transitionDuration={1500}
				className="flex-center h-[60vh] w-full"
				overlay="bg-black/40 border-b-4 golden"
			>
				<div className="flex-center w-[703px] h-[290px]">
					<span className="absolute top-0 left-0 w-[230px] h-[103px] border-white border-t-8 border-l-8" />
					<span className="absolute bottom-0 right-0 w-[230px] h-[103px] border-white border-b-8 border-r-8" />
					<div className="text-center text-white">
						<span
							className={`${inriaSerif.className} text-7xl`}
							style={{ fontStyle: "italic" }}
						>
							<p>Reservation</p>
							<p>History</p>
						</span>
						<p className="text-2xl">Your dining memories...</p>
					</div>
				</div>
			</SlideBackground>

			{/* Divider */}
			<div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[66px] mx-auto">
				<Line
					color="black"
					size={514}
					direction="horizontal"
					thinkness={3}
				/>
				<Star color="black" size={64} />
				<Line
					color="black"
					size={514}
					direction="horizontal"
					thinkness={3}
				/>
			</div>

			{/* Reservations Section */}
			<section className="relative text-center flex flex-col gap-11 w-[1280px] h-auto mt-[75px] mb-[100px] mx-auto">
				<span
					className={`${italiana.className} text-5xl`}
					data-aos="fade-up"
					data-aos-delay="0"
					data-aos-duration="650"
				>
					Your Reservations
				</span>

				{/* Filter Tabs */}
				<div
					className="flex flex-row gap-5 mx-auto"
					data-aos="fade-up"
					data-aos-delay="100"
					data-aos-duration="650"
				>
					<button
						onClick={() => setActiveFilter("all")}
						className={`px-8 py-2 border-2 border-black transition duration-300 ${
							activeFilter === "all"
								? "bg-black text-white"
								: "hover:bg-black hover:text-white"
						}`}
					>
						All
					</button>
					<button
						onClick={() => setActiveFilter("upcoming")}
						className={`px-8 py-2 border-2 border-black transition duration-300 ${
							activeFilter === "upcoming"
								? "bg-black text-white"
								: "hover:bg-black hover:text-white"
						}`}
					>
						Upcoming
					</button>
					<button
						onClick={() => setActiveFilter("completed")}
						className={`px-8 py-2 border-2 border-black transition duration-300 ${
							activeFilter === "completed"
								? "bg-black text-white"
								: "hover:bg-black hover:text-white"
						}`}
					>
						Completed
					</button>
					<button
						onClick={() => setActiveFilter("cancelled")}
						className={`px-8 py-2 border-2 border-black transition duration-300 ${
							activeFilter === "cancelled"
								? "bg-black text-white"
								: "hover:bg-black hover:text-white"
						}`}
					>
						Cancelled
					</button>
				</div>

				{/* Reservations List */}
				{filteredReservations.length > 0 ? (
					<div className="flex flex-col gap-6 mx-auto">
						{filteredReservations.map((reservation, i) => (
							<div
								key={reservation.id}
								className="relative flex flex-col w-[1100px] shadow-xl px-8 py-6 rounded-lg"
								style={{
									backgroundColor:
										cardColors[i % cardColors.length],
								}}
								data-aos="fade-up"
								data-aos-delay={i * 100}
								data-aos-duration="650"
							>
								{/* Status Badge */}
								<div className="flex justify-start mb-4">
									<span
										className="px-4 py-1.5 rounded-full text-white text-sm font-medium uppercase"
										style={{
											backgroundColor:
												statusColors[
													reservation.status
												],
										}}
									>
										{reservation.status}
									</span>
								</div>

								{/* Reservation Details */}
								<div
									className={`flex flex-row justify-between items-center ${
										i % cardColors.length === 2
											? "text-white"
											: "text-black"
									}`}
								>
									<div className="flex flex-col gap-3 text-left">
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<span className="text-2xl font-medium">
													{new Date(
														reservation.date
													).toLocaleDateString(
														"en-US",
														{
															weekday: "long",
															year: "numeric",
															month: "long",
															day: "numeric",
														}
													)}
												</span>
											</div>
										</div>

										<div className="flex items-center gap-8 text-lg">
											<div className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												<span>{reservation.time}</span>
											</div>

											<div className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
													/>
												</svg>
												<span>
													{reservation.guests}{" "}
													{reservation.guests === 1
														? "Guest"
														: "Guests"}
												</span>
											</div>

											<div className="flex items-center gap-2">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
													/>
												</svg>
												<span>{reservation.table}</span>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									{reservation.status === "upcoming" && (
										<div className="flex flex-col gap-2">
											<button className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300">
												Modify
											</button>
											<button
												className={`px-6 py-2 border-2 transition duration-300 ${
													i % cardColors.length === 2
														? "border-white hover:bg-white hover:text-black"
														: "border-black hover:bg-black hover:text-white"
												}`}
											>
												Cancel
											</button>
										</div>
									)}

									{reservation.status === "completed" && (
										<button className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300">
											Book Again
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					// Empty State (show when no reservations match filter)
					<div
						className="flex flex-col items-center gap-6 py-20"
						data-aos="fade-up"
						data-aos-delay="0"
						data-aos-duration="650"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-24 w-24 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<p className="text-2xl text-gray-500">
							No {activeFilter !== "all" ? activeFilter : ""}{" "}
							reservations found
						</p>
						<button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300 mt-4">
							Make a Reservation
						</button>
					</div>
				)}
			</section>

			{/* Bottom Divider */}
			<div className="relative flex items-center justify-between w-[1134px] h-[64px] mb-[100px] mx-auto">
				<Line
					color="black"
					size={514}
					direction="horizontal"
					thinkness={3}
				/>
				<Star color="black" size={64} />
				<Line
					color="black"
					size={514}
					direction="horizontal"
					thinkness={3}
				/>
			</div>
		</section>
	);
}
