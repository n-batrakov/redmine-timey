import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { useAppState } from 'state';
import { LoginPage, LogoutPage } from '../components/login';
import { login, logout } from '../state/actions';
import { useActions } from 'hooks';

const loginErrors = (errors: string[]) => React.useMemo(
    () => {
        if (errors === undefined || errors.length === 0) {
            return undefined;
        } else {
            return <ul>{errors.map((x, i) => <li key={i}>{x}</li>)}</ul>;
        }
    },
    [errors],
);

export const LoginPageContainer = () => {
    const state = useAppState(x => x.auth);
    const onSubmit = useActions(login);

    if (state.isLoggedIn) {
        return <Redirect to="/" />;
    }

    return (
        <LoginPage loading={state.loading} onSubmit={onSubmit} error={loginErrors(state.loginErrors)} />
    );
};


export const LogoutPageContainer = (props: RouteComponentProps) => {
    const isLoggedIn = useAppState(x => x.auth.isLoggedIn);
    const onLogout = useActions(logout);
    const onRedirect = React.useCallback(() => props.history.push('/login'), []);

    if (isLoggedIn === undefined || isLoggedIn) {
        onLogout();
    }

    return <LogoutPage onLoginRedirect={onRedirect} />;
};
