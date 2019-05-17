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

export const LoginForm = () => {
    return (
            <Form onSubmit={console.log} style={{
                margin: '22px auto',
                width: 421,
            }}>
                <FormRow>
                    <FormErrors
                        errors={['Invalid login or password']}
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
                        placeholder="Password"
                        required
                    />
                </FormRow>
                <FormRow>
                    <FormFooter>
                        <Button
                            submit
                            type="primary"
                            value="Login"
                            style={{
                                backgroundColor: '#2261a1',
                                borderColor: '#bbffe4',
                            }}/>
                    </FormFooter>
                </FormRow>
            </Form>
    );
};


export const LoginLogo = () => (
    <div className="timey-login-page-logo">
        <AnimatedClock date={new Date()} style={{
            height: 128,
            width: 128,
            margin: 'auto',
        }}/>
        <h1>Timey</h1>
        <p>Redmine Timesheets Assistant</p>
    </div>
);

export const LoginPage = () => {
    return (
        <div className="timey-login-page">
            <Grid fluid style={{ margin: 'auto' }}>
                <LoginLogo />
                <LoginForm />
            </Grid>
        </div>
    );
};