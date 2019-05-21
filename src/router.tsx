import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { TimingsPageContainer } from './containers/timings';
import { connect } from 'react-redux';
import { AppState } from './store';

const Component = (props: { isLoggedIn: boolean }) => (
    <Switch>
        {props.isLoggedIn ? undefined : <Redirect to="/login" />}
        <Redirect exact from="/" to="/time" />
        <Route path="/time" component={TimingsPageContainer} />
        <Route render={() => (<h1>404: This is not the page you are looking for</h1>)} />
    </Switch>
);

export const AppRouter = connect(
    (state: AppState) => ({
        isLoggedIn: state.auth.isLoggedIn,
    }),
    {},
)(Component);