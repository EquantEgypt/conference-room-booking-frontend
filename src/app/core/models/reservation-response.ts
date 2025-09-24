import { Timestamp } from "rxjs";
import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";
import { MeetingRoom } from "./meeting-room";

export interface ReservationResponse {
    reservationId: number | null,
    type: ReservationType | null,
    title: string | null,
    reason: string | null,
    date: Date | string | null,
    startTime: string | null,
    endTime: string | null,
    recurrenceOption: RecurrenceOption | null,
    recurrenceEndDate: Date | string | null,
    roomName: string | null,
    roomId?: number | null,
    numberOfReccurrences?: number | null
}

export function converToReservationResponse(raw: any): ReservationResponse {
    if (!raw) {
        return {
            reservationId: null,
            type: null,
            title: null,
            reason: null,
            date:null,
            startTime: null,
            endTime: null,
            recurrenceOption: null,
            recurrenceEndDate: null,
            roomName: null,
            roomId: null,
            numberOfReccurrences: null,
        };
    }

    return {
        reservationId: typeof raw.reservationId === "number"
            ? raw.reservationId
            : Number(raw.reservationId) || null,

        type: Object.values(ReservationType).includes(raw.type)
            ? raw.type
            : null,

        title: typeof raw.title === "string"
            ? raw.title
            : null,

        reason: typeof raw.reason === "string"
            ? raw.reason
            : null,

        date: raw.date ?? null,
        startTime: raw.startTime ?? null,
        endTime: raw.endTime ?? null,

        recurrenceOption: Object.values(RecurrenceOption).includes(raw.recurrenceOption)
            ? raw.recurrenceOption
            : null,

        recurrenceEndDate: raw.recurrenceEndDate
            ? new Date(raw.recurrenceEndDate)
            : null,

        roomName: raw.roomName ?? null
    };
}

export function convertToReservationList(rawList: any[]): ReservationResponse[] {
    if (!Array.isArray(rawList)) {
        return [];
    }
    return rawList.map(item => converToReservationResponse(item));
}
