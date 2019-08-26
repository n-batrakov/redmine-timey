import { RegisterHandler } from 'server/shared';

import addTimings from 'features/timeEntry/api/addTimings/handler';
import fetchTiming from 'features/timeEntry/api/fetchTiming/handler';
import deleteTiming from 'features/timeEntry/api/deleteTiming/handler';
import updateTiming from 'features/timeEntry/api/updateTiming/handler';
import queryIssues from 'features/timeEntry/api/queryIssues/handler';

import login from 'features/auth/api/login/handler';
import logout from 'features/auth/api/logout/handler';
import getSession from 'features/auth/api/getSession/handler';

import queryTimings from 'features/activityOverview/api/queryTimings/handler';
import getDailyHours from 'features/activityOverview/api/getDailyHours/handler';
import getMonthNorm from 'features/activityOverview/api/getMonthNorm/handler';

import getEnumerations from './getEnumerations/handler';

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