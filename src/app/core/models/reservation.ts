import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";

export interface Reservation {
    reservationId: number | null,
    description: string | null,
    RecurrenceOption: RecurrenceOption | RecurrenceOption.ONE_TIME,
    numberOfRecurrence?: number | null,
    startDate: Date | null,
    startTime: number | null,
    endTime: number | null,
    type: ReservationType,
    recurrenceOption: RecurrenceOption,
    roomId: number | null


    /*
            "reservationId": 95,
            "type": "INTERNAL",
            "description": "the meeting is about nothing",
            "startTime": "2025-12-10T07:00:00",
            "endTime": "2025-12-10T13:00:00",
            "recurrenceOption": "DAILY",
            "recurrenceEndDate": "2025-12-14T07:00:00",
            "roomId": 1
        */
}
