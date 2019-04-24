import './index.css';

import * as React from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './createStore';

import { AppRouter } from './router';
import { AppNavbar } from './containers/navbar';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                {<AppNavbar />}
                <div className="content">
                    <AppRouter />
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