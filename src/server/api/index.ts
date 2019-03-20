import { RegisterHandler } from './shared';
import getDayTimingsHanlder from './getDayTimings';
import getMonthDataHandler from './getMonthData';

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
    getMonthDataHandler,
];