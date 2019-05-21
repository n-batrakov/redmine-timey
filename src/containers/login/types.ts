import { AppState } from '../../store';
import { ThunkAction } from '../../store/thunk';

export type AuthState = {
    isLoggedIn?: boolean,
    loginErrors: string[],
    username: string,
    loading: boolean,
};

export type AuthAction = {
    type: 'auth_login',
    username: string,
} | {
    type: 'auth_logout',
} | {
    type: 'auth_setErrors',
    errors: string[],
} | {
    type: 'auth_loading',
};

export type AuthThunk = ThunkAction<void, AppState, {}, AuthAction>;