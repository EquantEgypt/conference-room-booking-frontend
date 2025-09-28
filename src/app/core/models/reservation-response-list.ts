import { ReservationResponse } from "./reservation-response";

export interface ReservationResponseList {
    isExpand : boolean,
    showExpandButton: boolean, 
    reservationResponseList: ReservationResponse[]
}
