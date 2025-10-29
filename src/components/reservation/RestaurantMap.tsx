// components/reservation/RestaurantMap.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloorMap } from "./FloorMap";
import { floorLayouts } from "@/data/floorLayouts";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
	weight: ["400", "700"],
	subsets: ["latin"],
});

interface Props {
	selectedTableId: string | null;
	onTableSelect: (tableId: string | null) => void;
	bookedTables: string[];
	notEnoughSpaceTables: string[];
	isLoading: boolean;
}

export default function RestaurantMap({
	selectedTableId,
	onTableSelect,
	bookedTables,
	notEnoughSpaceTables,
	isLoading,
}: Props) {
	const [selectedFloor, setSelectedFloor] = useState(1);

	const handleTableSelect = (tableId: string) => {
		// Allow deselecting by clicking the same table again
		onTableSelect(tableId === selectedTableId ? null : tableId);
	};

	const currentLayout =
		floorLayouts[selectedFloor as keyof typeof floorLayouts];

	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row gap-10 my-4">
				{/* Column 1: Floor Selector & Legend */}
				{/* Floor Selector */}
				<div>
					<h3 className="text-lg font-bold text-gold-700 mb-3">
						Floors
					</h3>
					<div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
						{[1, 2, 3].map((floor) => (
							<motion.button
								key={floor}
								onClick={() => setSelectedFloor(floor)}
								className={`w-full px-4 py-2 rounded-lg font-semibold text-base transition-all ${
									selectedFloor === floor
										? "bg-gradient-to-r from-gold-300 to-gold-500 text-white shadow-xl"
										: "bg-white text-gold-700 border-2 border-gold-300 hover:border-gold-500"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Floor {floor}
							</motion.button>
						))}
					</div>
				</div>
				{/* Column 2: Animated Map */}
				<div className="flex-1 w-full min-h-[300px] relative">
					<AnimatePresence mode="wait">
						<motion.div
							key={selectedFloor}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							<FloorMap
								tables={currentLayout.tables}
								vipRooms={currentLayout.vipRooms}
								bookedTables={bookedTables}
								notEnoughSpaceTables={notEnoughSpaceTables}
								onTableSelect={handleTableSelect}
								selectedTable={selectedTableId}
							/>
						</motion.div>
					</AnimatePresence>
					{isLoading && (
						<div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
							<p className="text-gold-800 font-semibold">
								Checking availability...
							</p>
						</div>
					)}
				</div>
				{/* Column 3: Legend */}{" "}
				<div>
					<h3 className="text-lg font-bold text-gold-700 mb-3">
						Legend
					</h3>
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-gold-50 border-2 border-gold-500 rounded"></div>
							<span className="text-gray-700 text-sm">
								Available
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-gold-500 border-2 border-gold-600 rounded"></div>
							<span className="text-gray-700 text-sm">
								Selected
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-[#3a3a3a] border-2 border-[#666] rounded"></div>
							<span className="text-gray-700 text-sm">
								Unavailable
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
