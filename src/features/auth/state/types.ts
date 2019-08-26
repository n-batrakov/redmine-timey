import { AppState } from 'store';
import { ThunkAction } from 'store/thunk';
import { UserSession } from 'shared/types';

export type AuthState = {
    isLoggedIn?: boolean,
    loading: boolean,
    loginErrors: string[],
    session?: UserSession,
};

export type AuthAction = {
    type: 'auth_login',
    session: UserSession,
} | {
    type: 'auth_logout',
} | {
    type: 'auth_setErrors',
    errors: string[],
} | {
    type: 'auth_loading',
};

export type AuthThunk = ThunkAction<void, AppState, {}, AuthAction>;