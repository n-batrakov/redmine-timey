import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { TimingsPageContainer } from './containers/timings';

export const AppRouter = () => (
    <Switch>
        <Route path="/" exact render={({ history }) => {
            history.push('/time');
            return undefined;
        }} />
        <Route path="/time" component={TimingsPageContainer} />
        <Route render={() => (<h1>404: This is not the page you are looking for</h1>)} />
    </Switch>
);