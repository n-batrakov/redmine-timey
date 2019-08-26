import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as activityListReducer } from './activityList/reducer';
import { reducer as timingsPageReducer }  from './timingList/reducer';
import { reducer as timingsFormReducer }  from '../features/timeEntry/state/timing/reducer';
import { reducer as issuesReducer } from 'features/timeEntry/state/issues/reducer';
import { reducer as enumerationsReducer } from './enumerations/reducer';
import { reducer as authReducer } from '../features/auth/state/reducer';
import { reducer as globalReducer } from './@global/reducer';
import { createThunkMiddleware } from './thunk';
import { sumReducers } from './composition';
import { errorHandler } from './errorHandler';


export const store = createStore(
    sumReducers(
        combineReducers({
            timingsPage: timingsPageReducer,
            timingsForm: timingsFormReducer,
            activityList: activityListReducer,
            enumerations: enumerationsReducer,
            issues: issuesReducer,
            auth: authReducer,
        }),
        globalReducer,
    ),
    applyMiddleware(createThunkMiddleware(errorHandler)),
);