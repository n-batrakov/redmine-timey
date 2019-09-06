import * as React from 'react';
import { Route, Switch, Redirect, NavLink } from 'react-router-dom';
import { useAppState, useActions } from 'state';
import { assertNever } from 'shared/utils';
import { Navbar } from 'components/navbar';
import { Logo } from 'components/logo';
import { NotFoundPage } from 'components/404';

import { LoginPageContainer, LogoutPageContainer } from 'features/auth/containers/auth';
import { ActivityOverviewPageContainer } from 'features/activityOverview/containers/activityOverview';
import { TimingPage } from 'features/timeEntry/containers/timing';
import { getSession } from 'features/auth/state/actions';
import { loadEnumerations } from 'features/enumerations/state/actions';

type AuthRouterProps = {
    isLoggedIn?: boolean,
    children?: React.ReactNode,
};
const AuthGuard = (props: AuthRouterProps) => {
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

const EnumerationsLoader = () => {
    const loadData = useActions(loadEnumerations);
    React.useEffect(() => { loadData(); }, []);

    return <></>;
};

export const AppRoot = () => {
    const isLoggedIn = useAppState(x => x.auth.isLoggedIn);
    const session = useAppState(x => x.auth.session);
    const actions = useActions({ getSession });
    const redmineHref = session === undefined ? '#' : session.redmineHost;

    React.useEffect(() => { actions.getSession(); }, []);

    return (
        <Switch>
            <Route path="/login" component={LoginPageContainer} />
            <Route path="/logout" component={LogoutPageContainer} />
            <Route>
                <AuthGuard isLoggedIn={isLoggedIn}>
                    <EnumerationsLoader />
                    <Navbar
                        logo={<Logo/>}
                        items={[
                            <NavLink to="/time" className="navbar-btn" activeClassName="active">Activity</NavLink>,
                        ]}
                        rightItems={[
                            <a className="navbar-btn" href={redmineHref} target="_blank" rel="noopener noreferrer">Redmine</a>,
                            <NavLink to="/logout" className="navbar-btn">Logout</NavLink>,
                        ]}
                    />
                    <Switch>
                        <Redirect exact from="/" to="/time" />
                        <Route path="/time/:id" component={TimingPage} />
                        <Route path="/time" component={ActivityOverviewPageContainer} />
                        <Route component={NotFoundPage} />
                    </Switch>
                </AuthGuard>
            </Route>
        </Switch>
    );
};
