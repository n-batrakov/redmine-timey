import fs from 'fs';
import csv from 'csv-parser';
import { getMonthBoundaries, addDays } from '../shared/date';

const monthHeaders = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export enum DayType {
    Full,
    Short,
    Holiday,
}
type CalendarFileItem = {
    year: number,
    data: Array<Array<DayType>>,
};

export type Calendar = {
    [year: number]: Array<Array<DayType>>,
}

function getMonthTotalDays(date: Date) {
    const [_, nextMonthStartDate] = getMonthBoundaries(date);
    return addDays(nextMonthStartDate, -1).getDate();
}

export function getCalendar(path: string) {
    return new Promise<Calendar>((resolve, reject) => {
        const results: CalendarFileItem[] = [];

        fs.createReadStream(path)
        .pipe(csv())
        .on('data', (line) => {
            const year = parseInt(line['Год/Месяц'], 10);

            const monthData = monthHeaders.map((monthKey, monthIdx) => {
                const daysInMonth = getMonthTotalDays(new Date(year, monthIdx, 1));
                const daysData = new Array<DayType>(daysInMonth).fill(DayType.Full);

                const holidaysString = <string>line[monthKey];
                holidaysString.split(',').forEach((day) => {
                    if (day.endsWith('*')) {
                        const dayIdx = parseInt(day.substring(0, day.length - 1), 10) - 1;
                        daysData[dayIdx] = DayType.Short;
                    } else {
                        const dayIdx = parseInt(day, 10) - 1;
                        daysData[dayIdx] = DayType.Holiday;
                    }
                });

                return daysData;
            });

            results.push({ year, data: monthData });
        })
        .on('end', () => {

            const calendar = results.reduce<Calendar>(
                (acc, x) => {
                    acc[x.year] = x.data;
                    return acc;
                },
                {});

            resolve(calendar);
        });
    });
}