import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { TimingsPageContainer } from './containers/timings';
import { connect } from 'react-redux';
import { AppState } from './store';
import { getSession } from './containers/login/actions';
import { CoverLoader } from './components/preloader';
import { assertNever } from './shared';

type AppRouterProps = {
    isLoggedIn?: boolean,
    getSession: () => void,
};
const Component = (props: AppRouterProps) => {
    React.useEffect(() => { props.getSession(); }, []);

    switch (props.isLoggedIn) {
        case undefined:
            return <CoverLoader active />;
        case true:
            return (
                <Switch>
                    {props.isLoggedIn ? undefined : <Redirect to="/login" />}
                    <Redirect exact from="/" to="/time" />
                    <Route path="/time" component={TimingsPageContainer} />
                    <Route render={() => (<h1>404: This is not the page you are looking for</h1>)} />
                </Switch>
            );
        case false:
            return <Redirect to="/login" />;
        default:
            assertNever(props.isLoggedIn);
            throw new Error('');
    }
};

export const AppRouter = connect(
    (state: AppState) => ({
        isLoggedIn: state.auth.isLoggedIn,
    }),
    {
        getSession,
    },
)(Component);