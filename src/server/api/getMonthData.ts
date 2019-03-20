import { RegisterHandler, authenticate, getCredentials } from './shared';
import { getTimesheetData, TimesheetEntry } from '../getTimesheetData';

function shiftDate(date: Date, numDays: number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}

const handler: RegisterHandler = (server, { redmine }) => server.route({
    method: 'GET',
    url: '/api/time/month',
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);

        const limit = 100;
        const from = new Date(Date.parse(<string>req.query['start']));
        const to = new Date(Date.parse(<string>req.query['end']));

        const pagingInfo = await getTimesheetData(redmine, { auth, from, to, limit: 1 });

        if (pagingInfo.code === 'Success') {
            const total = pagingInfo.totalCount;
            const pages = Math.ceil(total / limit);

            const promises = new Array(pages)
                .fill(undefined)
                .map((_, i) => getTimesheetData(redmine, { auth, from, to, limit, offset: limit * i }));

            const data = await Promise.all(promises);

            return Object.values(new Array<TimesheetEntry>()
                .concat(...data.map(x => x.code === 'Success' ? x.data : []))
                .reduce(
                    (acc: any, x: TimesheetEntry) => {
                        const key = x.spentOn.toISOString();
                        if (acc[key] === undefined) {
                            acc[key] = { date: x.spentOn, count: x.hours };
                        } else {
                            acc[key].count += x.hours;
                        }
                        return acc;
                    },
                    {}));
        }

        switch (pagingInfo.code) {
            case 'Error':
                resp.code(500);
                return {};
            case 'NotAuthenticated':
                resp.code(401);
                return {};
        }
    },
});

export default handler;