// data/floorLayouts.ts
import { FloorLayout } from "@/types/reservation";

export const floorLayouts: Record<number, FloorLayout> = {
	1: {
		tables: [
			{ id: "f1-t1", x: 75, y: 25, seats: 2, tableNumber: "T01", rotation: 90 },
			{ id: "f1-t2", x: 175, y: 25, seats: 2, tableNumber: "T02", rotation: 90 },
			{ id: "f1-t3", x: 275, y: 25, seats: 2, tableNumber: "T03", rotation: 90 },
			{ id: "f1-t4", x: 375, y: 25, seats: 2, tableNumber: "T04", rotation: 90 },
			{ id: "f1-t5", x: 475, y: 25, seats: 2, tableNumber: "T05", rotation: 90 },
			{ id: "f1-t6", x: 575, y: 25, seats: 2, tableNumber: "T06", rotation: 90 },
			{ id: "f1-t7", x: 675, y: 25, seats: 2, tableNumber: "T07", rotation: 90 },
			{ id: "f1-t8", x: 775, y: 25, seats: 2, tableNumber: "T08", rotation: 90 },
			{ id: "f1-t9", x: 75, y: 125, seats: 2, tableNumber: "T09", rotation: 90 },
			{ id: "f1-t10", x: 175, y: 125, seats: 2, tableNumber: "T10", rotation: 90 },
			{ id: "f1-t11", x: 275, y: 125, seats: 2, tableNumber: "T11", rotation: 90 },
			{ id: "f1-t12", x: 375, y: 125, seats: 2, tableNumber: "T12", rotation: 90 },
			{ id: "f1-t13", x: 475, y: 125, seats: 2, tableNumber: "T13", rotation: 90 },
			{ id: "f1-t14", x: 575, y: 125, seats: 2, tableNumber: "T14", rotation: 90 },
			{ id: "f1-t15", x: 675, y: 125, seats: 2, tableNumber: "T15", rotation: 90 },
			{ id: "f1-t16", x: 775, y: 125, seats: 2, tableNumber: "T16", rotation: 90 },
			{ id: "f1-t17", x: 55, y: 275, seats: 4, tableNumber: "T17", rotation: 90 },
			{ id: "f1-t18", x: 155, y: 275, seats: 4, tableNumber: "T18", rotation: 90 },
			{ id: "f1-t19", x: 255, y: 275, seats: 4, tableNumber: "T19", rotation: 90 },
			{ id: "f1-t20", x: 355, y: 275, seats: 4, tableNumber: "T20", rotation: 90 },
			{ id: "f1-t21", x: 455, y: 275, seats: 4, tableNumber: "T21", rotation: 90 },
			{ id: "f1-t22", x: 555, y: 275, seats: 4, tableNumber: "T22", rotation: 90 },
			{ id: "f1-t23", x: 655, y: 275, seats: 4, tableNumber: "T23", rotation: 90 },
			{ id: "f1-t24", x: 755, y: 275, seats: 4, tableNumber: "T24", rotation: 90 },
		],
		vipRooms: [],
	},
	2: {
		tables: [
			{ id: "f2-t1", x: 50, y: 50, seats: 4, tableNumber: "T21", rotation: 45 },
			{ id: "f2-t2", x: 200, y: 50, seats: 4, tableNumber: "T22" },
			{ id: "f2-t3", x: 450, y: 50, seats: 2, tableNumber: "T23" },
			{ id: "f2-t4", x: 50, y: 200, seats: 8, tableNumber: "T24" },
			{ id: "f2-t5", x: 300, y: 200, seats: 4, tableNumber: "T25" },
			{ id: "f2-t6", x: 50, y: 300, seats: 2, tableNumber: "T26" },
		],
		vipRooms: [],
	},
	3: {
		tables: [
			{ id: "f3-t1", x: 50, y: 50, seats: 8, tableNumber: "T31" },
			{ id: "f3-t2", x: 250, y: 50, seats: 8, tableNumber: "T32" },
			{ id: "f3-t3", x: 50, y: 150, seats: 4, tableNumber: "T33" },
			{ id: "f3-t4", x: 150, y: 150, seats: 4, tableNumber: "T34" },
			{ id: "f3-t5", x: 400, y: 150, seats: 2, tableNumber: "T35" },
		],
		vipRooms: [],
	},
};