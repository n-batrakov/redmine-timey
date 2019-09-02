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