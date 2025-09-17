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
  
    // roomId: number | null,

    


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
