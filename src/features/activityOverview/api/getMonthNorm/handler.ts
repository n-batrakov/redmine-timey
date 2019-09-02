import { metadata } from './contract';
import { RegisterHandler } from 'server/shared';
import { DayType } from 'server/workHoursNorm';
import { addDays, dateRange, getMonthBoundaries } from 'shared/date';
import { assertNever } from 'shared/utils';

const handler: RegisterHandler = (server, { calendar }) => server.route({
    ...metadata,
    handler: async (_, resp) => {
        const hoursPerDay = 8;

        const now = new Date();
        const year = now.getFullYear();
        const yearData = calendar[year];
        if (yearData === undefined) {
            resp.status(500);
            return {
                code: 'Error',
                message: 'Work calendar for current year not found. Please provide new calendar and restart the server app.',
            };
        }

        const [start, end] = getMonthBoundaries(now);

        const norm = Array.from(dateRange(start, addDays(end, -1))).reduce(
            (count, date) => {
                const month = date.getMonth();
                const day = date.getDate();

                const dayType = yearData[month][day - 1];

                switch (dayType) {
                    case DayType.Full:
                        return count + hoursPerDay;
                    case DayType.Short:
                        return count + hoursPerDay - 1;
                    case DayType.Holiday:
                        return count;
                    default:
                        assertNever(dayType);
                }
            },
            0,
        );

        return { norm };
    },
});

export default handler;