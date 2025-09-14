export interface MeetingRoomDTO {
  room_id: number;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  roomType: string;
  status: string;
  equipmentTypes: string[];
}

export interface RoomResponse {
  meetingRoomDTO: MeetingRoomDTO;
  imgPath: string;
}