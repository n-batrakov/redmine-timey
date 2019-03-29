import * as React from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';

import * as API from './client';

import { Logo } from './components/logo';
import { Navbar } from './components/navbar';
import { TimingsPage } from './pages/timings';

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
                <button className="navbar-btn active">Overview</button>,
            ]}
            rightItems={[
                <button className="navbar-btn" onClick={() => onLoginToggle(isLoggedOut, logOut)}>
                    {isLoggedOut ? 'Log In' : 'Log Out'}
                </button>,
            ]}
        />
    );

    return isLoggedOut
        ? navbar
        : <>
            {navbar}
            <TimingsPage />
        </>;
}

const appElement = document.getElementById('app') as HTMLElement;
Modal.setAppElement(appElement);
render(<App />, appElement);