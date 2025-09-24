import { Timestamp } from "rxjs";
import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";
import { Reservation } from "./reservation";


export interface ReservationRequest {
    roomName: string;
    type: ReservationType | null,
    description: string | null,
    title: string | null,
    date: Date | string | null,
    startTime: string | null,
    endTime: string | null,
    recurrenceOption: RecurrenceOption | null;
    roomId: number | null;
    numberOfOccurrences?: number | null;
}

export function convertToReservationRequest(reservation: Reservation | null): ReservationRequest {
    // Time formatting is handled in the component, just pass through the values
    return {
        type: reservation?.type ?? null, 
        description: reservation?.description ?? null,
        title: reservation?.title ?? null,
        date: reservation?.date ?? null,
        startTime: (reservation as any)?.startTime ?? null,
        endTime: (reservation as any)?.endTime ?? null,
        recurrenceOption: reservation?.recurrenceOption ?? null,
        roomId: (reservation as any)?.roomId ?? reservation?.meetingRoom?.roomId ?? null,
        numberOfOccurrences: (reservation as any)?.numberOfRecurrence ?? null,
        roomName: (reservation as any)?.roomName ?? reservation?.meetingRoom?.name ?? ''
    };

}
