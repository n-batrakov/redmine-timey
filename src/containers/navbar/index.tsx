import * as React from 'react';
import { Navbar } from '../../components/navbar';
import { Logo } from '../../components/logo';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from '../../state';
import { toggleLogin } from '../shared/actions';

export type AppNavbarProps = {
    isLoggedIn: boolean,
    onLoginToggle?: () => void,
};
const Component = (props: AppNavbarProps) => (
    <Navbar
        logo={<Logo/>}
        items={[
            <NavLink to="/time" className="navbar-btn" activeClassName="active">Time</NavLink>,
        ]}
    />
);

export const AppNavbar = connect(
    (state: AppState): AppNavbarProps => ({
        isLoggedIn: state.isLoggedIn,
    }),
    {
        onLoginToggle: toggleLogin,
    },
)(Component);