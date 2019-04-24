import { Dispatch } from 'redux';
import { getEnumerations } from '../../api/getEnumerations';
import { SharedStateAction, SharedStateThunk } from './types';
import { logout } from '../../api/logout';

export const loadEnumerations = () =>
    async (dispatch: Dispatch<SharedStateAction>) => {
        const data = await getEnumerations();
        dispatch({ data, type: 'enumerations_setValue' });
    };

export const setAuthState = (isLoggedIn: boolean): SharedStateAction =>
    ({ isLoggedIn, type: 'auth_loggedIn' });

export const toggleLogin = (): SharedStateThunk => (dispatch, getState) => {
    const isLoggedIn = getState().isLoggedIn;

    if (isLoggedIn) {
        // logout
        logout().then(() => dispatch(setAuthState(false)));
    } else {
        // login
        dispatch(setAuthState(true));
    }
};