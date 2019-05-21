import './index.css';
import * as React from 'react';
import { Form, FormFooter, FromErrors as FormErrors } from '../form';
import { TextInput } from '../input';
import { Row, Col, Grid } from '../layout';
import { Button } from '../button';
import { AnimatedClock } from '../animatedClock';

const FormRow = (props: { children: React.ReactNode }) => (
    <Row style={{
        margin: '8px 0',
    }}>
        <Col xs={12}>
            {props.children}
        </Col>
    </Row>
);

type LoginFormProps = {
    onSubmit?: (data: { login: string, password: string}) => void,
    errors: string[],
    loading?: boolean,
};
const LoginForm = (props: LoginFormProps) => {
    return (
        <Form onSubmit={props.onSubmit as any} style={{
            margin: '22px auto',
            width: 421,
        }}>
            <FormRow>
                <FormErrors
                    errors={props.errors || []}
                    style={{
                        backgroundColor: '#f66',
                        borderColor: '#f66',
                        color: '#fff',
                    }}/>
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
            <FormRow>
                <FormFooter>
                    <Button
                        submit
                        value="Log in"
                        className="timey-login-page-btn"
                        disabled={props.loading}
                    />
                </FormFooter>
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
            <Grid fluid style={{ margin: 'auto' }}>
                <LoginLogo loading={props.loading} />
                <LoginForm {...props} />
            </Grid>
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
            <Grid fluid style={{ margin: 'auto' }}>
                <LoginLogo loading={props.loading} />
                <p>You're logged out. Hope to see you back soon!</p>
                <Row>
                    <Col xs={12} xsOffset={4} >
                        <Button value="Log in" className="timey-login-page-btn" onClick={props.onLoginRedirect} />
                    </Col>
                </Row>
            </Grid>
        </div>
    );
};