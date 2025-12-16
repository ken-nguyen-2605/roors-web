// data/floorLayouts.ts
import { FloorLayout } from "@/types/reservation";

const F2_T4_OFFSET_X = -15;
const F2_T4_OFFSET_Y = 25;

const F2_T8_OFFSET_X = 5;
const F2_T8_OFFSET_Y = 260;
const F2_T8_SPACE_X = 110;

const F3_T8_OFFSET_X = 5;
const F3_T8_OFFSET_Y = 75;
const F3_T8_SPACE_X = 110;

const F3_T10_OFFSET_X = 50;
const F3_T10_OFFSET_Y = 225;
const F3_T10_SPACE_X = 175;

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
			{ id: "f2-t25", x: F2_T4_OFFSET_X + 50, y: F2_T4_OFFSET_Y, seats: 4, tableNumber: "T25" },
			{ id: "f2-t26", x: F2_T4_OFFSET_X + 200, y: F2_T4_OFFSET_Y, seats: 4, tableNumber: "T26" },
			{ id: "f2-t27", x: F2_T4_OFFSET_X + 350, y: F2_T4_OFFSET_Y, seats: 4, tableNumber: "T27" },
			{ id: "f2-t28", x: F2_T4_OFFSET_X + 500, y: F2_T4_OFFSET_Y, seats: 4, tableNumber: "T28" },
			{ id: "f2-t29", x: F2_T4_OFFSET_X + 650, y: F2_T4_OFFSET_Y, seats: 4, tableNumber: "T29" },
			{ id: "f2-t30", x: F2_T4_OFFSET_X + 800, y: F2_T4_OFFSET_Y, seats: 4, tableNumber: "T30" },
			{ id: "f2-t31", x: F2_T4_OFFSET_X + 50, y: F2_T4_OFFSET_Y + 100, seats: 4, tableNumber: "T31" },
			{ id: "f2-t32", x: F2_T4_OFFSET_X + 200, y: F2_T4_OFFSET_Y + 100, seats: 4, tableNumber: "T32" },
			{ id: "f2-t33", x: F2_T4_OFFSET_X + 350, y: F2_T4_OFFSET_Y + 100, seats: 4, tableNumber: "T33" },
			{ id: "f2-t34", x: F2_T4_OFFSET_X + 500, y: F2_T4_OFFSET_Y + 100, seats: 4, tableNumber: "T34" },
			{ id: "f2-t35", x: F2_T4_OFFSET_X + 650, y: F2_T4_OFFSET_Y + 100, seats: 4, tableNumber: "T35" },
			{ id: "f2-t36", x: F2_T4_OFFSET_X + 800, y: F2_T4_OFFSET_Y + 100, seats: 4, tableNumber: "T36" },
			{ id: "f2-t37", x: F2_T8_OFFSET_X + F2_T8_SPACE_X * 0, y: F2_T8_OFFSET_Y, seats: 8, tableNumber: "T37", rotation: 90 },
			{ id: "f2-t38", x: F2_T8_OFFSET_X + F2_T8_SPACE_X * 1, y: F2_T8_OFFSET_Y, seats: 8, tableNumber: "T38", rotation: 90 },
			{ id: "f2-t39", x: F2_T8_OFFSET_X + F2_T8_SPACE_X * 2, y: F2_T8_OFFSET_Y, seats: 8, tableNumber: "T39", rotation: 90 },
			{ id: "f2-t40", x: F2_T8_OFFSET_X + F2_T8_SPACE_X * 3, y: F2_T8_OFFSET_Y, seats: 8, tableNumber: "T40", rotation: 90 },
			{ id: "f2-t41", x: F2_T8_OFFSET_X + F2_T8_SPACE_X * 4, y: F2_T8_OFFSET_Y, seats: 8, tableNumber: "T41", rotation: 90 },
			{ id: "f2-t42", x: F2_T8_OFFSET_X + F2_T8_SPACE_X * 5, y: F2_T8_OFFSET_Y, seats: 8, tableNumber: "T42", rotation: 90 },
			{ id: "f2-t43", x: F2_T8_OFFSET_X + F2_T8_SPACE_X * 6, y: F2_T8_OFFSET_Y, seats: 8, tableNumber: "T43", rotation: 90 },
			{ id: "f2-t44", x: F2_T8_OFFSET_X + F2_T8_SPACE_X * 7, y: F2_T8_OFFSET_Y, seats: 8, tableNumber: "T44", rotation: 90 },
		],
		vipRooms: [],
	},
	3: {
		tables: [
			{ id: "f3-t45", x: F3_T8_OFFSET_X + F3_T8_SPACE_X * 0, y: F3_T8_OFFSET_Y, seats: 8, tableNumber: "T45", rotation: 90 },
			{ id: "f3-t46", x: F3_T8_OFFSET_X + F3_T8_SPACE_X * 1, y: F3_T8_OFFSET_Y, seats: 8, tableNumber: "T46", rotation: 90 },
			{ id: "f3-t47", x: F3_T8_OFFSET_X + F3_T8_SPACE_X * 2, y: F3_T8_OFFSET_Y, seats: 8, tableNumber: "T47", rotation: 90 },
			{ id: "f3-t48", x: F3_T8_OFFSET_X + F3_T8_SPACE_X * 3, y: F3_T8_OFFSET_Y, seats: 8, tableNumber: "T48", rotation: 90 },
			{ id: "f3-t49", x: F3_T8_OFFSET_X + F3_T8_SPACE_X * 4, y: F3_T8_OFFSET_Y, seats: 8, tableNumber: "T49", rotation: 90 },
			{ id: "f3-t50", x: F3_T8_OFFSET_X + F3_T8_SPACE_X * 5, y: F3_T8_OFFSET_Y, seats: 8, tableNumber: "T50", rotation: 90 },
			{ id: "f3-t51", x: F3_T8_OFFSET_X + F3_T8_SPACE_X * 6, y: F3_T8_OFFSET_Y, seats: 8, tableNumber: "T51", rotation: 90 },
			{ id: "f3-t52", x: F3_T8_OFFSET_X + F3_T8_SPACE_X * 7, y: F3_T8_OFFSET_Y, seats: 8, tableNumber: "T52", rotation: 90 },
			{ id: "f3-t53", x: F3_T10_OFFSET_X + F3_T10_SPACE_X * 0, y: F3_T10_OFFSET_Y, seats: 10, tableNumber: "T53" },
			{ id: "f3-t54", x: F3_T10_OFFSET_X + F3_T10_SPACE_X * 1, y: F3_T10_OFFSET_Y, seats: 10, tableNumber: "T54" },
			{ id: "f3-t55", x: F3_T10_OFFSET_X + F3_T10_SPACE_X * 2, y: F3_T10_OFFSET_Y, seats: 10, tableNumber: "T55" },
			{ id: "f3-t56", x: F3_T10_OFFSET_X + F3_T10_SPACE_X * 3, y: F3_T10_OFFSET_Y, seats: 10, tableNumber: "T56" },
			{ id: "f3-t57", x: F3_T10_OFFSET_X + F3_T10_SPACE_X * 4, y: F3_T10_OFFSET_Y, seats: 10, tableNumber: "T57" },
		],
		vipRooms: [],
	},
};