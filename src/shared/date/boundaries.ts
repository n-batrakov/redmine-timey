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