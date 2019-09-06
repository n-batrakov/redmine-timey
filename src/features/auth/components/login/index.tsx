import './index.scss';
import * as React from 'react';
import { Form, FormRow } from 'components/form';
import { Button } from 'components/button';
import { AnimatedClock } from 'components/animatedClock';
import { Danger } from 'components/alert';

type LoginFormProps = {
    onSubmit?: (data: { login: string, password: string}) => void,
    error?: React.ReactNode,
    loading?: boolean,
};
const LoginForm = (props: LoginFormProps) => {
    return (
        <Form onSubmit={props.onSubmit as any}>
            <FormRow>
                <Danger>{props.error}</Danger>
            </FormRow>
            <FormRow>
                Please enter your Redmine credentials:
            </FormRow>
            <FormRow>
                <input
                    type="text"
                    name="login"
                    placeholder="Login"
                    required
                />
            </FormRow>
            <FormRow>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
            </FormRow>
            <FormRow style={{ marginTop: 10 }}>
                <Button
                    kind="primary"
                    type="submit"
                    label="Log in"
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
    <div className="logo" >
        <AnimatedClock loading={props.loading} date={new Date()} style={{ height: 160 }}/>
        <h1>Timey</h1>
    </div>
);

export type LoginPageProps = LoginFormProps;
export const LoginPage = (props: LoginPageProps) => {
    return (
        <div className="timey-login-page">
            <div className="content">
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
            <div className="content">
                <LoginLogo loading={props.loading} />
                <p style={{ margin: '10px auto' }}>You're logged out. Hope to see you back soon!</p>
                <Button
                    label="Log in"
                    kind="primary"
                    onClick={props.onLoginRedirect}
                    style={{ marginTop: 10 }}
                />
            </div>
        </div>
    );
};