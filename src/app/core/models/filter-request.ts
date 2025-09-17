import { Filter } from "./filter";

export interface FilterRequest {
    date: Date | null,
    startTime: string | null,
    endTime: string | null,
    capacity: number | null,
    equipmentTypes: string[]
}

export function convertToFilterRequest(filter: Filter | null): FilterRequest {


    let equipments: string[] = filter?.equipmentTypes
        .filter(item => item.isChecked)
        .map(item => item.type) || [];

    return {
        date: filter?.date || null,
        startTime: filter?.startTime !== null ? convertFromNumberToTime(filter?.startTime) : null,
        endTime: filter?.endTime !== null ? convertFromNumberToTime(filter?.endTime) : null,
        capacity: filter?.capacity ?? null,
        equipmentTypes: equipments
    };
}
export function convertFromNumberToTime(hour: number | null | undefined): string | null {
    if (hour != null) {
        if (hour > 9) {
            return `${hour.toString()}:00:00`
        }
        else {
            return `0${hour.toString()}:00:00`
        }
    }
    return null;
}