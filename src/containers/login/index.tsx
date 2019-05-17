import * as React from 'react';
import { LoginPage } from '../../components/login';
import { AppState } from '../../state';
import { login } from './actions';
import { connect } from 'react-redux';

export type LoginContainerProps = {
    login: (credentials: {login: string, password: string}) => void,
    errors: string[],
};
const Component = (props: LoginContainerProps) => {
    return (
        <LoginPage onSubmit={props.login} errors={props.errors} />
    );
};

export const LoginPageContainer = connect(
    (state: AppState): Partial<LoginContainerProps> => ({
        errors: state.auth.loginErrors,
    }),
    {
        login,
    },
)(Component);