import { AuthThunk } from './types';
import { login as loginApi } from '../../api/login';
import { logout as logoutApi } from '../../api/logout';

type Credentials = {login: string, password: string};
export const login = (credentials: Credentials): AuthThunk => 
    async (dispatch) => {
        dispatch({ type: 'auth_loading' });

        const response = await loginApi(credentials);

        switch (response.status) {
            case 'success':
                dispatch({
                    type: 'auth_login',
                    username: credentials.login,
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
    dispatch({ type: 'auth_loading' });

    logoutApi()
    .then(() => {
        dispatch({ type: 'auth_logout' });
    })
    .catch((err) => {
        console.error(err);
    });
};