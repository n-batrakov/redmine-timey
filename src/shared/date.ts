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

export function getMonthBoundaries(date: Date): [Date, Date] {
    const startYear = date.getFullYear();
    const startMonth = date.getMonth();

    const endMonth = startMonth === 11 ? 0 : startMonth + 1;
    const endYear = startMonth === 11 ? startYear + 1 : startYear;

    return [
        new Date(Date.UTC(startYear, startMonth, 1)),
        new Date(Date.UTC(endYear, endMonth, 1)),
    ];
}

export function tryParseDate(str?: string): Date | undefined {
    if (str === undefined || str === null || str === '') {
        return undefined;
    }

    const dateNum = Date.parse(str);
    if (isNaN(dateNum)) {
        return undefined;
    }

    const date = new Date(dateNum);

    if (date.getFullYear() === NaN) {
        return undefined;
    }

    return date;
}