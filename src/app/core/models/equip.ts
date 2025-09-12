import { EquipResponse } from "./equip-response";

export interface Equip {
    equipment_id: number,
    type: string,
    isChecked: boolean
}

export function mapEquip(response: EquipResponse[]): Equip[] {
    return response.map(item => ({
        ...item,
        isChecked: false
    }));
}