import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function presentOrFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const inputDate = new Date(control.value);
        inputDate.setHours(0, 0, 0, 0);

        // Reject past dates
        if (inputDate < today) return { pastDate: true };

        // Reject "too far in future dates" future dates (e.g. more than 1 year ahead)
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() + 1);
        if (inputDate > maxDate) return { tooFarInFuture: true };

        return null;
    }
}

export function endTimeAfterStartTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const startStr: number = control.get('startTime')?.value;
        const endStr: number = control.get('endTime')?.value;

        if (startStr == null || endStr == null) return null;

        const start = Number(startStr);
        const end = Number(endStr);

        return end <= start ? { endBeforeStart: true } : null;
    };
}

export function capacityValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const valueStr = control?.value?.toString();

        //  if not valid
        if (!/^([1-9]\d*|0)$/.test(valueStr) || valueStr == null) { // Digits only, no leading zeros unless single "0"
            return { pattern: true };
        }

        console.log(valueStr + ' ' + typeof valueStr);

        const value = Number(valueStr);

        if (isNaN(value)) {
            return { pattern: true };
        }

        if (value < min || value > max) {
            return { range: true };
        }

        return null;
    };
}
