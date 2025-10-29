// components/reservation/FloorMap.tsx
import React from "react";
import { TableComponent } from "./TableComponent";
import { VIPRoomComponent } from "./VIPRoomComponent";
import { motion } from "framer-motion";
import { Table, VIPRoom } from "@/types/reservation";

interface FloorMapProps {
	tables: Table[];
	vipRooms: VIPRoom[];
	bookedTables: string[];
	notEnoughSpaceTables: string[];
	closedTables?: string[]; // Make prop optional
	onTableSelect: (tableId: string) => void;
	selectedTable: string | null;
}

export const FloorMap: React.FC<FloorMapProps> = ({
	tables,
	vipRooms,
	bookedTables,
	notEnoughSpaceTables,
	closedTables = [], // <-- ADD THIS DEFAULT VALUE
	onTableSelect,
	selectedTable,
}) => {
	const getTableStatus = (tableId: string) => {
		if (closedTables.includes(tableId)) return "closed";
		if (notEnoughSpaceTables.includes(tableId)) return "notEnoughSpace";
		if (bookedTables.includes(tableId)) return "booked";
		if (selectedTable === tableId) return "selected";
		return "available";
	};

	return (
		<>
			<motion.svg
				width="225"
				height="90"
				viewBox="0 0 900 360"
				className="w-full h-auto border-4 border-gold-800 rounded-lg shadow-inner"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				{/* Background Pattern */}
				<defs>
					<pattern
						id="floorPattern"
						x="0"
						y="0"
						width="50"
						height="50"
						patternUnits="userSpaceOnUse"
					>
						<rect width="50" height="50" fill="#fefdfb" />
						<circle
							cx="25"
							cy="25"
							r="1"
							fill="#e5d4b1"
							opacity="0.3"
						/>
					</pattern>
				</defs>
				<rect width="900" height="600" fill="url(#floorPattern)" />

				{/* VIP Rooms would go here if you re-enable them */}

				{/* Tables */}
				{tables.map((table) => (
					<TableComponent
						key={table.id}
						{...table}
						selected={selectedTable === table.id}
						status={getTableStatus(table.id) as any}
						onClick={() => onTableSelect(table.id)}
					/>
				))}
			</motion.svg>
		</>
	);
};