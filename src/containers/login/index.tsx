import * as React from 'react';
import { LoginPage, LogoutPage } from '../../components/login';
import { AppState } from '../../store';
import { login, logout } from './actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

export type LoginContainerProps = {
    isLoggedIn: boolean,
    loading?: boolean,
    login: (credentials: {login: string, password: string}) => void,
    errors: string[],
};
const LoginPageComponent = (props: LoginContainerProps) => {
    if (props.isLoggedIn) {
        return <Redirect to="/" />;
    }

    return (
        <LoginPage loading={props.loading} onSubmit={props.login} errors={props.errors} />
    );
};
export const LoginPageContainer = connect(
    (state: AppState, props: LoginContainerProps): Partial<LoginContainerProps> => ({
        ...props,
        isLoggedIn: state.auth.isLoggedIn,
        errors: state.auth.loginErrors,
        loading: state.auth.loading,
    }),
    {
        login,
    },
)(LoginPageComponent);


type LogoutPageProps = {
    isLoggedIn: boolean,
    logout: () => void,
    history: { push: (path: string) => void },
};
const LogoutPageComponent = (props: LogoutPageProps) => {
    if (props.isLoggedIn) {
        props.logout();
    }

    const onRedirect = React.useCallback(() => props.history.push('/login'), []);
    return <LogoutPage onLoginRedirect={onRedirect} />;
};
export const LogoutPageContainer = connect(
    (state: AppState, props: LogoutPageProps): Partial<LogoutPageProps> => ({
        isLoggedIn: state.auth.isLoggedIn,
        ...props,
    }),
    {
        logout,
    },
)(LogoutPageComponent);