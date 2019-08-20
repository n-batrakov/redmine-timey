import './index.css';
import * as React from 'react';
import { Form, FormRow } from '../form';
import { TextInput } from '../input';
import { Button } from '../button';
import { AnimatedClock } from '../animatedClock';
import { Danger } from '../alert';

type LoginFormProps = {
    onSubmit?: (data: { login: string, password: string}) => void,
    error?: React.ReactNode,
    loading?: boolean,
};
const LoginForm = (props: LoginFormProps) => {
    return (
        <Form onSubmit={props.onSubmit as any}>
            <FormRow>
                {props.error === undefined ? null : <Danger>{props.error}</Danger>}
            </FormRow>
            <FormRow>
                Please enter your Redmine credentials:
            </FormRow>
            <FormRow>
                <TextInput
                    name="login"
                    placeholder="Login"
                    required
                />
            </FormRow>
            <FormRow>
                <TextInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
            </FormRow>
            <FormRow floatRight>
                <Button
                    submit
                    value="Log in"
                    className="timey-login-page-btn"
                    disabled={props.loading}
                />
            </FormRow>
        </Form>
    );
};

type LoginLogoProps = {
    loading?: boolean,
};
const LoginLogo = (props: LoginLogoProps) => (
    <div className="timey-login-page-logo">
        <AnimatedClock loading={props.loading} date={new Date()} style={{
            height: 128,
            width: 128,
            margin: 'auto',
        }}/>
        <h1>Timey</h1>
        <p>Redmine Timesheets Assistant</p>
    </div>
);

export type LoginPageProps = LoginFormProps;
export const LoginPage = (props: LoginPageProps) => {
    return (
        <div className="timey-login-page">
            <div className="timey-login-page-content">
                <LoginLogo loading={props.loading} />
                <LoginForm {...props} />
            </div>
        </div>
    );
};

export type LogoutPageProps = {
    loading?: boolean,
    onLoginRedirect?: () => void,
};
export const LogoutPage = (props: LogoutPageProps) => {
    return (
        <div className="timey-login-page">
            <div className="timey-login-page-content">
                <LoginLogo loading={props.loading} />
                <p>You're logged out. Hope to see you back soon!</p>
                <Button value="Log in" className="timey-login-page-btn" onClick={props.onLoginRedirect} />
            </div>
        </div>
    );
};