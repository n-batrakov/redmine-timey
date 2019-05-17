import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../state';

export type AuthState = {
    isLoggedIn: boolean,
    loginErrors: string[],
    username: string,
};

export type AuthAction = {
    type: 'auth_login',
    username: string,
} | {
    type: 'auth_logout',
} | {
    type: 'auth_setErrors',
    errors: string[],
};

export type AuthThunk = ThunkAction<void, AppState, {}, AuthAction>;