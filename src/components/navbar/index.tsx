import './index.scss';
import * as React from 'react';

export type NavbarProps = {
    logo?: React.ReactNode,
    items?: Array<React.ReactNode>,
    rightItems?: Array<React.ReactNode>,
};

export const Navbar = (props: NavbarProps) => {
    const items = props.items || [];
    const rightItems = props.rightItems || [];

    return (
        <header className="navbar">
            <div className="navbar-logo">
                {props.logo}
            </div>
            <ul className="navbar-items">
                {items.map((x, i) => <li key={i}>{x}</li>)}
            </ul>
            <div className="navbar-items-right">
                {rightItems.map((x, i) => <div key={i}>{x}</div>)}
            </div>
        </header>
    );
};