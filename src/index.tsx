import * as React from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';

import * as API from './client';

import { Logo } from './components/logo';
import { Navbar } from './components/navbar';
import { TimingsPage } from './pages/timings';
import { TaskPage } from './pages/tasks';

import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';

import './index.css';

const onLoginToggle = (state: boolean, setState: (state: boolean) => void) => {
    if (state) {
        // login
        setState(false);
    } else {
        // logout
        API.logout().then(() => {
            setState(true);
        });
    }
}

const App = () => {
    
    const [isLoggedOut, logOut] = React.useState(false);

    const navbar = (
        <Navbar
            logo={<Logo/>}
            items={[
                <NavLink to="/time" className="navbar-btn" activeClassName="active">Time</NavLink>,
                <NavLink to="/task" className="navbar-btn" activeClassName="active">Task</NavLink>,
            ]}
            rightItems={[
                <button className="navbar-btn" onClick={() => onLoginToggle(isLoggedOut, logOut)}>
                    {isLoggedOut ? 'Log In' : 'Log Out'}
                </button>,
            ]}
        />
    );

    return (
        <Router>
            {navbar}
            <div className="content">
                <Switch>
                    <Route path="/" exact component={TimingsPage} />
                    <Route path="/time" component={TimingsPage} />
                    <Route path="/task" component={TaskPage} />
                </Switch>
            </div>
        </Router>
    );
}

const appElement = document.getElementById('app') as HTMLElement;
Modal.setAppElement(appElement);
render(<App />, appElement);