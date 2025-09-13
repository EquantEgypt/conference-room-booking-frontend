import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";

export interface Reservation {
    description: string | null,
    RecurrenceOption: RecurrenceOption | RecurrenceOption.ONE_TIME,
    startDate: Date | null,
    endDate: Date | null,
    startTime: number | null,
    endTime: number | null,
    type: ReservationType,
    recurrenceOption: RecurrenceOption,
    roomId: number | null
}
