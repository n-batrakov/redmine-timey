import { assertNever } from 'shared';
import { AuthState, AuthAction } from './types';

export const initState: AuthState = {
    isLoggedIn: undefined,
    loading: false,
    loginErrors: [],
};

export const reducer = (state: AuthState, action: AuthAction): AuthState => {
    if (state === undefined) {
        return initState;
    }

    switch (action.type) {
        case 'auth_login':
            return {
                isLoggedIn: true,
                session: action.session,
                loginErrors: [],
                loading: false,
            };
        case 'auth_logout':
            return {
                isLoggedIn: false,
                session: undefined,
                loginErrors: [],
                loading: false,
            };
        case 'auth_setErrors':
            return {
                isLoggedIn: false,
                session: undefined,
                loginErrors: action.errors,
                loading: false,
            };
        case 'auth_loading':
            return {
                ...state,
                loading: true,
            };
        default:
            assertNever(action);
            return state;
    }
};