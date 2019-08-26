import { RegisterHandler } from '../server/shared';

import addTimings from './addTimings/handler';
import deleteTiming from './deleteTiming/handler';
import updateTiming from './updateTiming/handler';
import queryTimings from './queryTimings/handler';
import queryIssues from './queryIssues/handler';
import getDailyHours from './getDailyHours/handler';
import getEnumerations from './getEnumerations/handler';
import getMonthNorm from './getMonthNorm/handler';
import login from '../features/auth/api/login/handler';
import logout from '../features/auth/api/logout/handler';
import getSession from '../features/auth/api/getSession/handler';
import fetchTiming from './fetchTiming/handler';

export default <RegisterHandler[]> [
    addTimings,
    deleteTiming,
    updateTiming,
    queryTimings,
    fetchTiming,
    queryIssues,
    getDailyHours,
    getEnumerations,
    getMonthNorm,
    login,
    logout,
    getSession,
];