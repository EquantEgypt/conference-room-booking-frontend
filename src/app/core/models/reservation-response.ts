import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";

export interface ReservationResponse {
    reservationId: number | null,
    type: ReservationType | null,
    description: string | null,
    startTime: number | null,
    endTime: number | null,
    recurrenceOption: RecurrenceOption | null,
    recurrenceEndDate: Date | null,
    roomId: number | null,
}

export function converToReservationResponse(raw: any): ReservationResponse {
    if (!raw) {
        return {
            reservationId: null,
            type: null,
            description: null,
            startTime: null,
            endTime: null,
            recurrenceOption: null,
            recurrenceEndDate: null,
            roomId: null,
        };
    }

    return {
        reservationId: typeof raw.reservationId === "number"
            ? raw.reservationId
            : Number(raw.reservationId) || null,

        type: Object.values(ReservationType).includes(raw.type)
            ? raw.type
            : null,

        description: typeof raw.description === "string"
            ? raw.description
            : null,

        startTime: raw.startTime ? new Date(raw.startTime).getTime() : null,

        endTime: raw.endTime ? new Date(raw.endTime).getTime() : null,

        recurrenceOption: Object.values(RecurrenceOption).includes(raw.recurrenceOption)
            ? raw.recurrenceOption
            : null,

        recurrenceEndDate: raw.recurrenceEndDate
            ? new Date(raw.recurrenceEndDate)
            : null,

        roomId: typeof raw.roomId === "number"
            ? raw.roomId
            : Number(raw.roomId) || null,
    };
}

export function convertToReservationList(rawList: any[]): ReservationResponse[] {
    if (!Array.isArray(rawList)) {
        return [];
    }
    return rawList.map(item => converToReservationResponse(item));
}
