export function addDays(date:Date, numDays:number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}

export function* getRange(start: Date, end?: Date, step?: number) {
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

export function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}