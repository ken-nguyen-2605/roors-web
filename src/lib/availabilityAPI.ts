// lib/availabilityAPI.ts
import { floorLayouts } from "@/data/floorLayouts";

// Mock database of existing reservations
const mockReservations = [
	{ date: "2025-10-29", time: "12:00", tableId: "f1-t4" },
	{ date: "2025-10-29", time: "19:00", tableId: "f2-t1" },
	{ date: "2025-10-30", time: "20:00", tableId: "f1-t18" },
	{ date: "2025-10-30", time: "20:00", tableId: "f3-t1" },
];

interface AvailabilityParams {
	date: string;
	time: string;
	guests: number;
}

interface AvailabilityResult {
	bookedTables: string[];
	notEnoughSpaceTables: string[];
}

/**
 * Simulates fetching table availability from an API.
 * @param params - The date, time, and number of guests for the reservation.
 * @returns A promise that resolves to the availability result.
 */
export const fetchTableAvailability = async (
	params: AvailabilityParams
): Promise<AvailabilityResult> => {
	console.log("Fetching availability for:", params);

	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 250));

	// Find tables that are booked for the selected date and time
	const bookedTables = mockReservations
		.filter((r) => r.date === params.date && r.time === params.time)
		.map((r) => r.tableId);

	// Find tables that don't have enough seats
	const notEnoughSpaceTables: string[] = [];
	if (params.guests > 0) {
		Object.values(floorLayouts).forEach((floor) => {
			floor.tables.forEach((table) => {
				if (table.seats < params.guests) {
					notEnoughSpaceTables.push(table.id);
				}
			});
		});
	}

	return {
		bookedTables,
		notEnoughSpaceTables,
	};
};