import { ThunkErrorHandler } from './thunk';
import { AppState, AppAction } from '.';
import { NotAuthorizedError } from '../shared/errors';

export const errorHandler: ThunkErrorHandler<AppState, {}, AppAction> = (error, dispatch, getState) => {
    if (error.name === NotAuthorizedError.Name) {
        dispatch({ type: 'auth_logout' });
    } else {
        console.error(error);
    }
};