export function weekday(dayIndex: number) {
    // TODO: determine first day index from current culture
    const firstDayIndex = 0;
    return adjustWeekdayIndex(dayIndex, firstDayIndex);
}

export function adjustWeekdayIndex(dayIndx: number, firstDayIndex: number) {
    const daysInWeek = 7;

    return (daysInWeek + (dayIndx - firstDayIndex)) % daysInWeek;
}

export function isWeekend(date: Date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}