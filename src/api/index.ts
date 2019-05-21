import { RegisterHandler } from '../server/shared';

import addTimings from './addTimings/handler';
import deleteTiming from './deleteTiming/handler';
import updateTiming from './updateTiming/handler';
import queryTimings from './queryTimings/handler';
import queryIssues from './queryIssues/handler';
import getDailyHours from './getDailyHours/handler';
import getEnumerations from './getEnumerations/handler';
import getMonthNorm from './getMonthNorm/handler';
import login from './login/handler';
import logout from './logout/handler';
import getSession from './getSession/handler';

export default <RegisterHandler[]> [
    addTimings,
    deleteTiming,
    updateTiming,
    queryTimings,
    queryIssues,
    getDailyHours,
    getEnumerations,
    getMonthNorm,
    login,
    logout,
    getSession,
];