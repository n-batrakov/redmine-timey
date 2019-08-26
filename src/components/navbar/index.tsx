import './index.scss';
import * as React from 'react';

export type NavbarProps = {
    logo?: React.ReactNode,
    items: Array<React.ReactNode>,
    rightItems?: Array<React.ReactNode>,
};

export class Navbar extends React.Component<NavbarProps> {
    public render() {
        const items = this.props.items.map((x, i) => <li key={i}>{x}</li>);

        const itemsRigthNodes = this.props.rightItems || [];
        const itemsRight = itemsRigthNodes.map((x, i) => <div key={i}>{x}</div>);

        return (
            <header className="navbar">
                <div className="navbar-logo">
                    {this.props.logo}
                </div>
                <ul className="navbar-items">
                    {items}
                </ul>
                <div className="navbar-items-right">
                    {itemsRight}
                </div>
            </header>
        );
    }
}
