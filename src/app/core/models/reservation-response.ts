import { Timestamp } from "rxjs";
import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";
import { MeetingRoom } from "./meeting-room";

export interface ReservationResponse {
    reservationId: number | null,
    type: ReservationType | null,
    title: string | null,
    description: string | null,
    date: Date | null,
    startTime: Timestamp<number> | null,
    endTime: Timestamp<number> | null,
    recurrenceOption: RecurrenceOption | null,
    recurrenceEndDate: Date | null,
    meetingRoom: MeetingRoom | null;
}

export function converToReservationResponse(raw: any): ReservationResponse {
    if (!raw) {
        return {
            reservationId: null,
            type: null,
            title: null,
            description: null,
            date:null,
            startTime: null,
            endTime: null,
            recurrenceOption: null,
            recurrenceEndDate: null,
            meetingRoom: null
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

        description: typeof raw.description === "string"
            ? raw.description
            : null,

        date: raw.date ? new Date(raw.date) : null,

        startTime: raw.startTime
            ? ({ value: new Date(raw.startTime).getTime(), timestamp: new Date(raw.startTime).getTime() } as Timestamp<number>)
            : null,
        endTime: raw.endTime
            ? ({ value: new Date(raw.endTime).getTime(), timestamp: new Date(raw.endTime).getTime() } as Timestamp<number>)
            : null,

        // startTime: raw.startTime ? new Date(raw.startTime).getTime() : null,

        // endTime: raw.endTime ? new Date(raw.endTime).getTime() : null,

        recurrenceOption: Object.values(RecurrenceOption).includes(raw.recurrenceOption)
            ? raw.recurrenceOption
            : null,

        recurrenceEndDate: raw.recurrenceEndDate
            ? new Date(raw.recurrenceEndDate)
            : null,

         
        meetingRoom: raw.meetingRoom
            ? {
                roomId: raw.meetingRoom.roomId ?? null,
                name: raw.meetingRoom.name ?? null,
                building: raw.meetingRoom.building ?? "",
                floor: raw.meetingRoom.floor ?? 0,
                capacity: raw.meetingRoom.capacity ?? 1,
                roomType: raw.meetingRoom.roomType ?? "",
                status: raw.meetingRoom.status ?? "",
                equipmentTypes: raw.meetingRoom.equipmentTypes ?? []
            }
            : null
    };
}

export function convertToReservationList(rawList: any[]): ReservationResponse[] {
    if (!Array.isArray(rawList)) {
        return [];
    }
    return rawList.map(item => converToReservationResponse(item));
}
