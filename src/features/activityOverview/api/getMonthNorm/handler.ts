import { metadata, GetMonthNormResponse } from './contract';
import { RegisterHandler } from 'server/shared';
import { DayType, Calendar } from 'server/workHoursNorm';
import { addDays, dateRange, getMonthBoundaries } from 'shared/date';
import { assertNever } from 'shared/utils';
import { getTimesheetData } from 'server/getTimesheetData';
import { getCredentials } from 'server/auth';

const handler: RegisterHandler = (server, { redmine, calendar }) => server.route({
    ...metadata,
    handler: async (req, resp): Promise<GetMonthNormResponse> => {
        const { year, month } = req.query as { year: number, month: number };

        const now = new Date(Date.UTC(year, month - 1, 1));
        const [start, end] = getMonthBoundaries(now);

        const auth = getCredentials(req);
        const timings = await getTimesheetData(redmine, { auth, from: start, to: end, limit: 500 });
        if (timings.code !== 'Success') {
            resp.code(timings.status);
            return timings;
        }

        const actualValue = timings.data.reduce((acc, x) => acc + x.hours, 0);

        const expectedValue = calculateExpectedValue(start, end, calendar);
        if (expectedValue === undefined) {
            resp.code(500);
            return {
                code: 'Error',
                errors: ['Work calendar for current year not found. Please provide new calendar and restart the server app.'],
                status: 500,
            };
        }

        return {
            code: 'Success',
            data: { actualValue, expectedValue },
        };
    },
});

function calculateExpectedValue(start: Date, end: Date, calendar: Calendar) {
    const hoursPerDay = 8;

    const year = start.getFullYear();
    const yearData = calendar[year];
    if (yearData === undefined) {
        return undefined;
    }

    const expected = Array.from(dateRange(start, addDays(end, -1))).reduce(
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

    return expected;
}

export default handler;