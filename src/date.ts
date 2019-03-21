export function addDays(date:Date, numDays:number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}

export function* getRange(start: Date, end?: Date) {
    yield start;

    let current = addDays(start, 1);
    while (true) {

        if (end !== undefined && current >= end) {
            yield end;
            return;
        }

        yield current;

        current = addDays(current, 1);
    }
}

export function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}