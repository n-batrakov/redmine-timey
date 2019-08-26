import { AppState, AppAction } from '..';
import { initState as actitivityListInitState } from 'features/activityOverview/state/activityList/reducer';
import { initialState as timingsPageInitState }  from 'features/activityOverview/state/timingList/reducer';
import { initialState as timingsFormInitState }  from 'features/timeEntry/state/timing/reducer';
import { initState as issuesInitState } from 'features/timeEntry/state/issues/reducer';

export const reducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'auth_logout':
            return {
                timingsPage: timingsPageInitState,
                timingsForm: timingsFormInitState,
                activityList: actitivityListInitState,
                issues: issuesInitState,
                auth: state.auth,
                enumerations: state.enumerations,
            };
        default:
            return state;
    }
};