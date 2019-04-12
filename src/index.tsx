import * as React from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';

import { logout } from './api/logout';

import { Logo } from './components/logo';
import { Navbar } from './components/navbar';


import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';

import './index.css';
import { Provider } from 'react-redux';
import { store } from './createStore';
import { TimingsPageContainer } from './containers/timings';
import { IssuesPage } from './containers/issues';

const onLoginToggle = (state: boolean, setState: (state: boolean) => void) => {
    if (state) {
        // login
        setState(false);
    } else {
        // logout
        logout().then(() => {
            setState(true);
        });
    }
};

const App = () => {
    const [isLoggedOut, logOut] = React.useState(false);

    const navbar = (
        <Navbar
            logo={<Logo/>}
            items={[
                <NavLink to="/time" className="navbar-btn" activeClassName="active">Time</NavLink>,
                <NavLink to="/issue" className="navbar-btn" activeClassName="active">Issues</NavLink>,
            ]}
            rightItems={[
                <button className="navbar-btn" onClick={() => onLoginToggle(isLoggedOut, logOut)}>
                    {isLoggedOut ? 'Log In' : 'Log Out'}
                </button>,
            ]}
        />
    );

    return (
        <Provider store={store}>
            <Router>
                {navbar}
                <div className="content">
                    <Switch>
                        <Route path="/" exact render={({ history }) => {
                            history.push('/time');
                            return undefined;
                        }} />
                        <Route path="/time" component={TimingsPageContainer} />
                        <Route path="/issue" component={IssuesPage} />
                        <Route render={() => (<h1>404: This is not the page you are looking for</h1>)} />
                    </Switch>
                </div>
            </Router>
        </Provider>
    );
};



const appElement = document.getElementById('app') as HTMLElement;
Modal.setAppElement(appElement);
render(
    <App/>,
    appElement,
);