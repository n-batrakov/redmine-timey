import * as React from 'react';
import { Route, Switch, Redirect, NavLink } from 'react-router-dom';
import { TimingsPageContainer } from '../features/activityOverview/containers/timingList';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { getSession } from '../features/auth/state/actions';
import { assertNever } from '../shared';
import { LoginPageContainer, LogoutPageContainer } from '../features/auth/containers/auth';
import { Navbar } from '../components/navbar';
import { Logo } from '../components/logo';
import { UserSession } from '../shared/types';
import { NotFoundPage } from '../components/404';
import { TimingPage } from '../features/timeEntry/containers/timing';
import { loadEnumerations } from '../store/enumerations/actions';

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