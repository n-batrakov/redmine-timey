import './index.css';

import * as React from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/createStore';

import { AppRouter } from './router';
import { AppNavbar } from './containers/navbar';
import { LoginPageContainer } from './containers/login';

console.log('Do you have a problem, question or suggestion? Please, visit: https://github.com/n-batrakov/redmine-timey/issues/new');

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route path="/login" component={LoginPageContainer} />
                    <Route>
                        {<AppNavbar />}
                        <div className="content">
                            <AppRouter />
                        </div>
                    </Route>
                </Switch>
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