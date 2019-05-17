import { AuthState, AuthAction } from './types';
import { assertNever } from '../../shared';

const initState: AuthState = {
    loginErrors: [],
    isLoggedIn: false,
    username: '',
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
            };
        case 'auth_logout':
            return {
                ...state,
                username: '',
                isLoggedIn: false,
            };
        case 'auth_setErrors':
            return {
                ...state,
                loginErrors: action.errors,
            };
        default:
            assertNever(action);
            return state;
    }
};