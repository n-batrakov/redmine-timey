import * as React from 'react';
import { Navbar } from '../../components/navbar';
import { Logo } from '../../components/logo';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from '../../store';

export type AppNavbarProps = {
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
    }),
    {
    },
)(Component);