import './index.scss';
import * as React from 'react';

export type ListItemProps = {
    selected?: boolean,
    children?: React.ReactNode,
    style?: React.CSSProperties,
    clickable?: boolean,
    onClick?: () => void,
};
export const ListItem = (props: ListItemProps) => (
    <li
        style={props.style}
        onClick={props.onClick}
        className={`${props.clickable ? 'clickable' : ''} ${props.selected ? 'selected' : ''}`}
    >
        {props.children}
    </li>
);


export type ListProps = {
    children: React.ReactNode,
    style?: React.CSSProperties,
};
export const List = (props: ListProps) => (
    <ul className="timey-list" style={props.style}>
        {props.children}
    </ul>
);