import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as activityListReducer } from './containers/activityList/reducer';
import { reducer as timingsPageReducer }  from './containers/timings/reducer';
import { reducer as issuesReducer } from './containers/issues/reducer';
import { isLoggedInReducer, enumerationsReducer } from './containers/shared/reducer';
import { loadEnumerations } from './containers/shared/actions';


export const store = createStore(
    combineReducers({
        timingsPage: timingsPageReducer,
        activityList: activityListReducer,
        isLoggedIn: isLoggedInReducer,
        enumerations: enumerationsReducer,
        issues: issuesReducer,
    }),
    applyMiddleware(thunk),
);

loadEnumerations()(store.dispatch);