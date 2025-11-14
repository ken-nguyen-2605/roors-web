// types/reservation.ts
export interface ReservationDetails {
	name: string;
	email: string;
	phone: string;
	guests: number;
	date: string;
	time: string;
	tableId: string | null;
}

export interface Table {
	id: string;
	x: number;
	y: number;
	seats: 2 | 4 | 8 | 10;
	tableNumber: string;
	rotation?: number;
}

export interface VIPRoom {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	capacity: 10 | 20;
	roomName: string;
}

export interface FloorLayout {
	tables: Table[];
	vipRooms: VIPRoom[];
}