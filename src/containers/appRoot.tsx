import * as React from 'react';
import { Route, Switch, Redirect, NavLink } from 'react-router-dom';
import { TimingsPageContainer } from './timingsPage';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { getSession } from '../store/auth/actions';
import { CoverLoader } from '../components/preloader';
import { assertNever } from '../shared';
import { LoginPageContainer, LogoutPageContainer } from './auth';
import { Navbar } from '../components/navbar';
import { Logo } from '../components/logo';
import { UserSession } from '../shared/types';

type AuthRouterProps = {
    isLoggedIn?: boolean,
    getSession: () => void,
    children?: React.ReactNode,
};
const AuthGuard = (props: AuthRouterProps) => {
    React.useEffect(() => { props.getSession(); }, []);

    switch (props.isLoggedIn) {
        case undefined:
            return <CoverLoader active />;
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
};
const Root = (props: RootProps) => {
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
                    <div className="content">
                        <Switch>
                            <Redirect exact from="/" to="/time" />
                            <Route path="/time" component={TimingsPageContainer} />
                            <Route render={() => (<h1>404: This is not the page you are looking for</h1>)} />
                        </Switch>
                    </div>
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
    },
)(Root);