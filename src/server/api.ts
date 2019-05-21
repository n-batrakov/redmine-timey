import { RegisterHandler } from './shared';

import addTimings from '../api/addTimings/handler';
import deleteTiming from '../api/deleteTiming/handler';
import updateTiming from '../api/updateTiming/handler';
import queryTimings from '../api/queryTimings/handler';
import queryIssues from '../api/queryIssues/handler';
import getDailyHours from '../api/getDailyHours/handler';
import getEnumerations from '../api/getEnumerations/handler';
import getMonthNorm from '../api/getMonthNorm/handler';
import login from '../api/login/handler';
import logout from '../api/logout/handler';
import getSession from '../api/getSession/handler';

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