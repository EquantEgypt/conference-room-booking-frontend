import { RecurrenceOption } from "../enum/recurrence-option";
import { ReservationType } from "../enum/reservation-type";
import { Reservation } from "./reservation";

export interface ReservationRequest {
    type: ReservationType | null,
    description: string | null,
    startTime: Date | null,
    endTime: Date | null;
    recurrenceOption: RecurrenceOption | null;
    numberOfRecurrence?: number | null;
    roomId: number | null;
}

export function convertToReservationRequest(reservation: Reservation | null): ReservationRequest {
    let startTime: Date | null = null;
    let endTime: Date | null = null;

    if (reservation?.startDate) {

        if (reservation?.startTime !== null) {
            startTime = new Date(reservation?.startDate);
            startTime?.setHours(reservation?.startTime, 0, 0, 0);
        }

        if (reservation?.endTime !== null) {
            endTime = new Date(reservation?.startDate);
            endTime?.setHours(reservation?.endTime, 0, 0, 0);
        }
    }

    return {
        type: reservation?.type ?? null,
        description: reservation?.description ?? null,
        startTime,
        endTime,
        recurrenceOption: reservation?.recurrenceOption ?? null,
        numberOfRecurrence: reservation?.numberOfRecurrence ?? null,
        roomId: reservation?.roomId ?? null
    };
}

