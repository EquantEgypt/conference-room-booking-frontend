import { Filter } from "./filter";

export interface FilterRequest {
    date: Date | null;
    startTime: string | null;
    endTime: string | null;
    capacity: number | null;
    equipmentTypes: string[];
}

export function convertToFilterRequest(filter: Filter | null): FilterRequest {
    let equipments: string[] = filter?.equipmentTypes
        ? filter.equipmentTypes.filter((item: any) => item.isChecked).map((item: any) => item.type)
        : [];

    return {
        date: filter?.date || null,
        startTime: filter?.startTime ?? null,
        endTime: filter?.endTime ?? null,
        capacity: filter?.capacity ?? null,
        equipmentTypes: equipments
    };
}