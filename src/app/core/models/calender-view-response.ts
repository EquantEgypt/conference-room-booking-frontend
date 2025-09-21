import { CalenderViewReservation } from "./calender-view-reservation";

export interface CalenderViewResponse {

    roomId: number,
    roomName:string,
    roomCapacity:number,

    reservations: CalenderViewReservation[];
    
}
