import { AuthThunk } from './types';
import { login as loginApi } from '../../api/login';
import { logout as logoutApi } from '../../api/logout';
import { getSession as getSessionApi } from '../../api/getSession';

type Credentials = {login: string, password: string};
export const login = (credentials: Credentials): AuthThunk =>
    async (dispatch) => {
        dispatch({ type: 'auth_loading' });

        const response = await loginApi(credentials);

        switch (response.status) {
            case 'success':
                dispatch({
                    type: 'auth_login',
                    session: response.session,
                });
                return;
            case 'error':
                dispatch({
                    type: 'auth_setErrors',
                    errors: ['Sorry :( We\'re unable to log you in. Something went wrong. Please try again later or contact someone.'],
                });
                return;
            case 'notAuthenticated':
                dispatch({
                    type: 'auth_setErrors',
                    errors: ['Login or Password is invalid, sorry. Feel free to try again.'],
                });
                return;
        }
    };

export const logout = (): AuthThunk => (dispatch) => {
    logoutApi()
    .then(() => {
        dispatch({ type: 'auth_logout' });
    })
    .catch((err) => {
        console.error(err);
    });
};

export const getSession = (): AuthThunk => async (dispatch, getState) => {
    const { auth } = getState();
    if (auth.isLoggedIn) {
        return;
    }

    const session = await getSessionApi();
    dispatch({ session, type: 'auth_login' });
};