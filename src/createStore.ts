import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as activityListReducer } from './containers/activityList/reducer';
import { reducer as timingsPageReducer }  from './containers/timings/reducer';
import { reducer as issuesReducer } from './containers/issues/reducer';
import { enumerationsReducer } from './containers/shared/reducer';
import { loadEnumerations } from './containers/shared/actions';
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

loadEnumerations()(store.dispatch);