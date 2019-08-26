import 'styles/global.scss';

import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/createStore';

import { AppRoot } from './containers/appRoot';

console.log('Do you have a problem, question or suggestion? Please, visit: https://github.com/n-batrakov/redmine-timey/issues/new');

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <AppRoot />
            </Router>
        </Provider>
    );
};

const appElement = document.getElementById('app') as HTMLElement;
render(
    <App/>,
    appElement,
);