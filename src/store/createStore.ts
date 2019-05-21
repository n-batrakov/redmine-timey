import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as activityListReducer } from '../containers/activityList/reducer';
import { reducer as timingsPageReducer }  from '../containers/timings/reducer';
import { reducer as issuesReducer } from '../containers/issues/reducer';
import { reducer as enumerationsReducer } from '../containers/enumerations/reducer';
import { reducer as authReducer } from '../containers/login/reducer';
import { AppState } from './';
import { NotAuthorizedError } from '../shared/errors';
import { ThunkErrorHandler, createThunkMiddleware } from './thunk';
import { AppAction } from '.';


const errorHandler: ThunkErrorHandler<AppState, {}, AppAction> = (error, dispatch, getState) => {
    if (error.name === NotAuthorizedError.Name) {
        dispatch({ type: 'auth_logout' });
    } else {
        console.error(error);
    }
};

export const store = createStore(
    combineReducers({
        timingsPage: timingsPageReducer,
        activityList: activityListReducer,
        enumerations: enumerationsReducer,
        issues: issuesReducer,
        auth: authReducer,
    }),
    applyMiddleware(createThunkMiddleware(errorHandler)),
);