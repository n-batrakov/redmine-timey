import { AppState, AppAction } from '..';
import { initState as actitivityListInitState } from '../activityList/reducer';
import { initialState as timingsPageInitState }  from '../timingsPage/reducer';
import { initialState as timingsFormInitState }  from '../timingsForm/reducer';
import { initState as issuesInitState } from '../issues/reducer';

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