import { AuthState, AuthAction } from './types';
import { assertNever } from '../../shared';

export const initState: AuthState = {
    loginErrors: [],
    username: '',
    loading: false,
};

export const reducer = (state: AuthState, action: AuthAction): AuthState => {
    if (state === undefined) {
        return initState;
    }

    switch (action.type) {
        case 'auth_login':
            return {
                loginErrors: [],
                isLoggedIn: true,
                username: action.username,
                loading: false,
            };
        case 'auth_logout':
            return {
                ...state,
                username: '',
                isLoggedIn: false,
                loading: false,
            };
        case 'auth_setErrors':
            return {
                ...state,
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