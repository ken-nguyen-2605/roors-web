// components/restaurant/TableComponent.tsx

import { motion } from "framer-motion";

interface TableProps {
	id: string;
	x: number;
	y: number;
	seats: 2 | 4 | 8 | 10;
	status: "available" | "booked" | "notEnoughSpace" | "closed";
	tableNumber: string;
	selected?: boolean;
	onClick?: () => void;
	rotation?: number;
}

export const TableComponent: React.FC<TableProps> = ({
	id,
	x,
	y,
	seats,
	status,
	tableNumber,
	selected = false,
	onClick,
	rotation = 0,
}) => {
	const getTableDimensions = () => {
		const baseSize = 40;
		switch (seats) {
			case 2:
				return { width: baseSize, height: baseSize };
			case 4:
				return { width: baseSize * 2, height: baseSize };
			case 8:
				return { width: baseSize * 3, height: baseSize };
			case 10:
				return {
					width: baseSize * 2.5,
					height: baseSize * 2.5,
					radius: baseSize * 1.25,
				};
			default:
				throw new Error("Invalid number of seats");
		}
	};

	const getStatusColor = () => {
		if (selected) {
			return {
				fill: "#d4af37",
				stroke: "#b8941f",
			};
		}

		switch (status) {
			case "available":
				return {
					fill: "#f8f5f0",
					stroke: "#d4af37",
				};
			case "notEnoughSpace":
				return {
					fill: "#3a3a3a",
					stroke: "#666",
				};
			case "booked":
				return {
					fill: "#3a3a3a",
					stroke: "#666",
				};
			case "closed":
				return { fill: "#3a3a3a", stroke: "#666" };
			default:
				return { fill: "#f8f5f0", stroke: "#d4af37" };
		}
	};

	const { width, height, radius } = getTableDimensions();
	const colors = getStatusColor();

	const renderChairs = () => {
		const chairSize = 20;
		const chairWidth = chairSize * 0.35;
		const chairLength = chairSize * 1.1;
		const chairs = [];

		const chairFill = selected ? "#b8941f" : colors.stroke;

		if (seats === 2) {
			chairs.push(
				<motion.rect
					key="chair1"
					x={x + width / 2 - chairLength / 2}
					y={y - chairWidth}
					width={chairLength}
					height={chairWidth}
					rx="1"
					fill={chairFill}
					opacity="0.8"
					transition={{ duration: 0.2 }}
				/>,
				<motion.rect
					key="chair2"
					x={x + width / 2 - chairLength / 2}
					y={y + height}
					width={chairLength}
					height={chairWidth}
					rx="1"
					fill={chairFill}
					opacity="0.8"
					transition={{ duration: 0.2 }}
				/>
			);
		} else if (seats === 4) {
			const chairGap = chairLength * 0.6;
			chairs.push(
				<motion.rect
					key="chair-top-left"
					x={x + width / 2 - chairGap / 2 - chairLength}
					y={y - chairWidth}
					width={chairLength}
					height={chairWidth}
					rx="1"
					fill={chairFill}
					opacity="0.8"
					transition={{ duration: 0.2 }}
				/>,
				<motion.rect
					key="chair-top-right"
					x={x + width / 2 + chairGap / 2}
					y={y - chairWidth}
					width={chairLength}
					height={chairWidth}
					rx="1"
					fill={chairFill}
					opacity="0.8"
					transition={{ duration: 0.2 }}
				/>,
				<motion.rect
					key="chair-bottom-left"
					x={x + width / 2 - chairGap / 2 - chairLength}
					y={y + height}
					width={chairLength}
					height={chairWidth}
					rx="1"
					fill={chairFill}
					opacity="0.8"
					transition={{ duration: 0.2 }}
				/>,
				<motion.rect
					key="chair-bottom-right"
					x={x + width / 2 + chairGap / 2}
					y={y + height}
					width={chairLength}
					height={chairWidth}
					rx="1"
					fill={chairFill}
					opacity="0.8"
					transition={{ duration: 0.2 }}
				/>
			);
		} else if (seats === 8) {
			const numberOfChairs = 3;
			const chairGap = chairLength * 0.6;
			const startX =
				x +
				(width -
					(numberOfChairs * chairLength +
						(numberOfChairs - 1) * chairGap)) /
					2;
			for (let i = -1; i <= 1; i++) {
				chairs.push(
					<motion.rect
						key={`chair-top-${i}`}
						x={startX + (i + 1) * (chairLength + chairGap)}
						y={y - chairWidth}
						width={chairLength}
						height={chairWidth}
						rx="1"
						fill={chairFill}
						opacity="0.8"
						transition={{ duration: 0.2 }}
					/>,
					<motion.rect
						key={`chair-bottom-${i}`}
						x={startX + (i + 1) * (chairLength + chairGap)}
						y={y + height}
						width={chairLength}
						height={chairWidth}
						rx="1"
						fill={chairFill}
						opacity="0.8"
						transition={{ duration: 0.2 }}
					/>
				);
			}
			chairs.push(
				<motion.rect
					key="chair-left"
					x={x - chairWidth}
					y={y + height / 2 - chairLength / 2}
					width={chairWidth}
					height={chairLength}
					rx="1"
					fill={chairFill}
					opacity="0.8"
					transition={{ duration: 0.2 }}
				/>,
				<motion.rect
					key="chair-right"
					x={x + width}
					y={y + height / 2 - chairLength / 2}
					width={chairWidth}
					height={chairLength}
					rx="1"
					fill={chairFill}
					opacity="0.8"
					transition={{ duration: 0.2 }}
				/>
			);
		} else if (seats === 10) {
			const centerX = x + width / 2;
			const centerY = y + height / 2;
			const chairRadius = radius! + chairWidth / 2 - 1;

			for (let i = 0; i < 10; i++) {
				const angle = (i * 36 - 90) * (Math.PI / 180);
				const chairX =
					centerX + chairRadius * Math.cos(angle) - chairLength / 2;
				const chairY =
					centerY + chairRadius * Math.sin(angle) - chairWidth / 2;
				const chairRotation = i * 36;

				chairs.push(
					<motion.rect
						key={`chair-${i}`}
						x={chairX}
						y={chairY}
						width={chairLength}
						height={chairWidth}
						rx="1"
						fill={chairFill}
						opacity="0.8"
						transform={`rotate(${chairRotation} ${
							chairX + chairLength / 2
						} ${chairY + chairWidth / 2})`}
						transition={{ duration: 0.2 }}
					/>
				);
			}
			return chairs;
		}

		return chairs;
	};


	const textCenterX = x + width / 2;
	const textCenterY = y + height / 2;

	return (
		<motion.g
			initial={{ rotate: rotation }}
			animate={{ rotate: rotation }}
			style={{
				cursor: !["booked", "notEnoughSpace"].includes(status)
					? "pointer"
					: "not-allowed",
				transformOrigin: `${x + width / 2}px ${y + height / 2}px`,
			}}
			onClick={
				!["booked", "notEnoughSpace"].includes(status)
					? onClick
					: undefined
			}
			whileHover={status === "available" ? { scale: 1.05, rotate: rotation } : { rotate: rotation }}
			whileTap={status === "available" ? { scale: 0.95, rotate: rotation } : { rotate: rotation }}
			transition={{ duration: 0.2 }}
		>
			{renderChairs()}
			{seats === 10 ? (
				<motion.circle
					cx={x + width / 2}
					cy={y + height / 2}
					r={radius}
					fill={colors.fill}
					stroke={colors.stroke}
					transition={{ duration: 0.2 }}
				/>
			) : (
				<motion.rect
					x={x}
					y={y}
					width={width}
					height={height}
					rx="1"
					fill={colors.fill}
					stroke={colors.stroke}
					transition={{ duration: 0.2 }}
				/>
			)}
			{/* Text with counter-rotation to keep it upright */}
			<text
				x={textCenterX}
				y={textCenterY}
				textAnchor="middle"
				dominantBaseline="middle"
				fill={
					selected
						? "#fff"
						: ["booked", "notEnoughSpace"].includes(status)
						? "#000"
						: "#2c1810"
				}
				fontSize="14"
				fontWeight="600"
				fontFamily="Playfair Display, serif"
				style={{ pointerEvents: "none" }}
				// Apply counter-rotation to keep text upright
				transform={`rotate(${-rotation} ${textCenterX} ${textCenterY})`}
			>
				{tableNumber}
			</text>
		</motion.g>
	);
};