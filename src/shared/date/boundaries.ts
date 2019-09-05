import { addDays } from './core';

export function getMonthBoundaries(date: Date, exclusive: boolean = false): [Date, Date] {
    const startYear = date.getFullYear();
    const startMonth = date.getMonth();

    const endMonth = startMonth === 11 ? 0 : startMonth + 1;
    const endYear = startMonth === 11 ? startYear + 1 : startYear;

    const start = new Date(Date.UTC(startYear, startMonth, 1));
    const end = new Date(Date.UTC(endYear, endMonth, 1));

    return [
        start,
        exclusive ? addDays(end, -1) : end,
    ];
}