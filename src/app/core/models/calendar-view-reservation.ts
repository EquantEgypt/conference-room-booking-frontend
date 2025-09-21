import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";

export interface calendarViewReservation {
    reservationId:number,
    type: ReservationType,
    title: string,
    date: Date,
    startTime: number,
    endTime: number,
    recurrenceOption: RecurrenceOption,
    myReservation:boolean
}
