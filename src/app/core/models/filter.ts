import { Equip } from "./equip";

export interface Filter {
    date: Date | null,
    startTime: number | null,
    endTime: number | null,
    capacity: number | null,
    equipmentTypes: Equip[]
}