import { AppState, AppAction } from '.';
import { combineReducers } from 'redux';
import { sumReducers } from './composition';

import * as Auth from 'features/auth/state/reducer';
import * as Enumerations from 'features/enumerations/state/reducer';
import * as Activity from 'features/activityOverview/state/activityList/reducer';
import * as TimingList  from 'features/activityOverview/state/timingList/reducer';
import * as TimingForm  from 'features/timeEntry/state/timing/reducer';
import * as Issues from 'features/timeEntry/state/issues/reducer';

const globalReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'auth_logout':
            return {
                timingsPage: TimingList.initialState,
                timingsForm: TimingForm.initialState,
                activityList: Activity.initState,
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
        timingsPage: TimingList.reducer,
        timingsForm: TimingForm.reducer,
        activityList: Activity.reducer,
        issues: Issues.reducer,
    }),
    globalReducer,
);