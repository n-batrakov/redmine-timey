import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as activityListReducer } from './containers/activityList/reducer';
import { reducer as timingsPageReducer }  from './containers/timings/reducer';
import { reducer as issuesReducer } from './containers/issues/reducer';
import { reducer as enumerationsReducer } from './containers/enumerations/reducer';
import { reducer as authReducer } from './containers/login/reducer';


export const store = createStore(
    combineReducers({
        timingsPage: timingsPageReducer,
        activityList: activityListReducer,
        enumerations: enumerationsReducer,
        issues: issuesReducer,
        auth: authReducer,
    }),
    applyMiddleware(thunk),
);