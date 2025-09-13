export interface MeetingRoom {
  roomId: number;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  roomType: string;
  status: string;
  equipmentTypes: string[];
}