import * as React from 'react';
import { LoginPage } from '../../components/login';
import { AppState } from '../../store';
import { login } from './actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

export type LoginContainerProps = {
    isLoggedIn: boolean,
    loading?: boolean,
    login: (credentials: {login: string, password: string}) => void,
    errors: string[],
};
const Component = (props: LoginContainerProps) => {
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
)(Component);