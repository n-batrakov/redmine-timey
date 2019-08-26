import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, NavLink } from 'react-router-dom';
import { AppState } from 'store';
import { assertNever } from 'shared/utils';
import { UserSession } from 'shared/types';
import { Navbar } from 'components/navbar';
import { Logo } from 'components/logo';
import { NotFoundPage } from 'components/404';

import { LoginPageContainer, LogoutPageContainer } from 'features/auth/containers/auth';
import { TimingsPageContainer } from 'features/activityOverview/containers/timingList';
import { TimingPage } from 'features/timeEntry/containers/timing';
import { getSession } from 'features/auth/state/actions';
import { loadEnumerations } from 'features/enumerations/state/actions';

type AuthRouterProps = {
    isLoggedIn?: boolean,
    getSession: () => void,
    children?: React.ReactNode,
};
const AuthGuard = (props: AuthRouterProps) => {
    React.useEffect(() => { props.getSession(); }, []);

    switch (props.isLoggedIn) {
        case undefined:
            return null;
        case true:
            if (props.children === undefined) {
                return null;
            } else {
                return <>{props.children}</>;
            }
        case false:
            return <Redirect to="/login" />;
        default:
            assertNever(props.isLoggedIn);
            throw new Error('');
    }
};

type RootProps = {
    session?: UserSession,
    isLoggedIn?: boolean,
    getSession: () => void,
    loadEnumerations: () => void,
};
const Root = (props: RootProps) => {
    React.useEffect(() => { props.loadEnumerations(); }, []);

    const redmineHref = props.session === undefined ? '#' : props.session.redmineHost;

    return (
        <Switch>
            <Route path="/login" component={LoginPageContainer} />
            <Route path="/logout" component={LogoutPageContainer} />
            <Route>
                <AuthGuard {...props}>
                    <Navbar
                        logo={<Logo/>}
                        items={[
                            <NavLink to="/time" className="navbar-btn" activeClassName="active">Time</NavLink>,
                        ]}
                        rightItems={[
                            <a className="navbar-btn" href={redmineHref}>Redmine</a>,
                            <NavLink to="/logout" className="navbar-btn">Logout</NavLink>,
                        ]}
                    />
                    <Switch>
                        <Redirect exact from="/" to="/time" />
                        <Route path="/time/:id" component={TimingPage} />
                        <Route path="/time" component={TimingsPageContainer} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </AuthGuard>
            </Route>
        </Switch>
    );
};
export const AppRoot = connect(
    (state: AppState): Partial<RootProps> => ({
        isLoggedIn: state.auth.isLoggedIn,
        session: state.auth.session,
    }),
    {
        getSession,
        loadEnumerations,
    },
)(Root);