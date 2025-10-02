import { calendarViewReservation } from "./calendar-view-reservation";

export interface calendarViewResponse {

    roomId: number,
    roomName:string,
    roomCapacity:number,

    reservations: calendarViewReservation[];
    
}
