import { DateScope } from "../enum/date-scope";
import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";

export interface MyBookingFilter {
    dateScope: DateScope,
    recurrenceOption: RecurrenceOption,
    reservationType: ReservationType
}