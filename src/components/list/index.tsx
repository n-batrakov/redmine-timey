import './index.scss';
import * as React from 'react';
import classNames from 'classnames';

const getItemClassName = (props: ListItemProps) => classNames(
    'timey-list-item',
    props.className,
    {
        clickable: props.clickable,
        selected: props.selected,
        inline: props.inline,
    },
);

export type ListItemProps = {
    inline?: boolean,
    selected?: boolean,
    children?: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    clickable?: boolean,
    onClick?: () => void,
};
export const ListItem = (props: ListItemProps) => (
    <li
        style={props.style}
        onClick={props.onClick}
        className={getItemClassName(props)}
    >
        {props.children}
    </li>
);


export type ListProps = {
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
};
export const List = (props: ListProps) => (
    <ul className={classNames('timey-list', props.className)} style={props.style}>
        {props.children}
    </ul>
);