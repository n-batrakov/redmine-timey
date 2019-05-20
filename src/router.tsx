import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { TimingsPageContainer } from './containers/timings';

export const AppRouter = () => (
    <Switch>
        <Redirect exact from="/" to="/time" />
        <Route path="/time" component={TimingsPageContainer} />
        <Route render={() => (<h1>404: This is not the page you are looking for</h1>)} />
    </Switch>
);