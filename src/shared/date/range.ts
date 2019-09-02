import { addDays } from './core';

export function* dateRange(start: Date, end?: Date, step?: number) {
    let current = start;
    const daysToAdd = step || 1;
    const compare: ((a: Date, b: Date) => boolean) =
        step === undefined || step > 0
            ? (a, b) => a >= b
            : (a, b) => a <= b;

    while (true) {

        if (end !== undefined && compare(current, end)) {
            yield end;
            return;
        }

        yield current;

        current = addDays(current, daysToAdd);
    }
}