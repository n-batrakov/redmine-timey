import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as activityListReducer } from './activityList/reducer';
import { reducer as timingsPageReducer }  from './timingsPage/reducer';
import { reducer as issuesReducer } from './issues/reducer';
import { reducer as enumerationsReducer } from './enumerations/reducer';
import { reducer as authReducer } from './auth/reducer';
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