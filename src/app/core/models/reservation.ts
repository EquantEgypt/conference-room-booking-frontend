import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";
import { MeetingRoom } from "./meeting-room";

export interface Reservation {
    reservationId: number | null,
    title: string | null,
    description: string | null,
    recurrenceOption: RecurrenceOption | RecurrenceOption.ONE_TIME,
    numberOfRecurrence?: number | null,
    date: Date | null,
    startTime: number | null,
    endTime: number | null,
    type: ReservationType,
    meetingRoom: MeetingRoom | null
}