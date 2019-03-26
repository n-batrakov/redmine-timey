import { RegisterHandler } from './shared';
import getDayTimingsHanlder from './getDayTimings';
import getHoursPerDayHandler from './getHoursPerDay';
import getMonthNorm from './getMonthNorm';

const signOutHandler: RegisterHandler = server => server.route({
    method: 'POST',
    url:'/api/logout',
    handler: async (_, resp) => {
        resp.status(401);
        return {};
    },
});

export default <RegisterHandler[]> [
    signOutHandler,
    getDayTimingsHanlder,
    getHoursPerDayHandler,
    getMonthNorm,
];