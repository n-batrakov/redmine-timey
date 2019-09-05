import { AppState, AppAction } from '.';
import { combineReducers } from 'redux';
import { sumReducers } from './composition';

import * as Auth from 'features/auth/state/reducer';
import * as Enumerations from 'features/enumerations/state/reducer';
import * as Activity from 'features/activityOverview/state/activityList/reducer';
import * as HoursGauge from 'features/activityOverview/state/hoursGauge/reducer';
import * as Calendar from 'features/activityOverview/state/calendar/reducer';
import * as TimingForm  from 'features/timeEntry/state/timing/reducer';
import * as Issues from 'features/timeEntry/state/issues/reducer';

const globalReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'auth_logout':
            return {
                timingsForm: TimingForm.initialState,
                activityList: Activity.initState,
                hoursGauge: HoursGauge.initialState,
                calendar: Calendar.initialState,
                issues: Issues.initState,
                auth: state.auth,
                enumerations: state.enumerations,
            };
        default:
            return state;
    }
};

export default sumReducers(
    combineReducers({
        auth: Auth.reducer,
        enumerations: Enumerations.reducer,
        timingsForm: TimingForm.reducer,
        activityList: Activity.reducer,
        hoursGauge: HoursGauge.reducer,
        calendar: Calendar.reducer,
        issues: Issues.reducer,
    }),
    globalReducer,
);