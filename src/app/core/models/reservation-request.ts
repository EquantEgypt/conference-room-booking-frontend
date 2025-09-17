import { Timestamp } from "rxjs";
import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";
import { Reservation } from "./reservation";


export interface ReservationRequest {
    type: ReservationType | null,
    description: string | null,
    title: string | null,
    date: Date | null,
    startTime: Timestamp<number> | null,
    endTime: Timestamp<number> | null,
    recurrenceOption: RecurrenceOption | null;
   
}

export function convertToReservationRequest(reservation: Reservation | null): ReservationRequest {
    let startTime: Date | null = null;
    let endTime: Date | null = null;

    if (reservation?.date) {

        if (reservation?.startTime !== null) {
            startTime = new Date(reservation?.date);
            startTime?.setHours(reservation?.startTime, 0, 0, 0);
        }

        if (reservation?.endTime !== null) {
            endTime = new Date(reservation?.date);
            endTime?.setHours(reservation?.endTime, 0, 0, 0);
        }

    }

    return {
        type: reservation?.type ?? null,
        description: reservation?.description ?? null,
        title: reservation?.title ?? null,
        date: reservation?.date ?? null,
        startTime: reservation?.startTime !== null && startTime !== null ? ({ value: startTime.getTime(), timestamp: startTime.getTime() } as Timestamp<number>) : null,
        endTime: reservation?.endTime !== null && endTime !== null ? ({ value: endTime.getTime(), timestamp: endTime.getTime() } as Timestamp<number>) : null,
        recurrenceOption: reservation?.recurrenceOption ?? null,
    };
}

