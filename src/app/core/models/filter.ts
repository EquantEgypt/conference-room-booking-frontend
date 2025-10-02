import { Equip } from "./equip";

export interface Filter {
    date: Date | null;
    startTime: string | null;
    endTime: string | null;
    capacity: number | null;
    equipmentTypes: Equip[];
    numberOfRecurrence?: number | null;
}