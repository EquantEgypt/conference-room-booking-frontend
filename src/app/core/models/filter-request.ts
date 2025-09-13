import { Filter } from "./filter";

export interface FilterRequest {
    startTime: Date | null,
    endTime: Date | null,
    capacity: number | null,
    equipmentTypes: string[]
}

export function convertToFilterRequest(filter: Filter | null): FilterRequest {
    let startTime: Date | null = null;
    let endTime: Date | null = null;

    if (filter?.date) {

        if (filter?.startTime !== null) {
            startTime = new Date(filter?.date);
            startTime?.setHours(filter?.startTime, 0, 0, 0);
        }

        if (filter?.endTime !== null) {
            endTime = new Date(filter?.date);
            endTime?.setHours(filter?.endTime, 0, 0, 0);
        }
    }

    let equipments: string[] = filter?.equipmentTypes.filter(item => item.isChecked)
    .map(item => item.type ) || [];

    return {
        startTime,
        endTime,
        capacity: filter!.capacity,
        equipmentTypes: equipments
    };
}
