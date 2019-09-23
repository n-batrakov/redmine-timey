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

export type ListSkeletonProps = {
    size?: number,
    className?: string,
    itemClassName?: string,
    style?: React.CSSProperties,
};
export const ListSkeleton = (props: ListSkeletonProps) => (
    <List className={props.className} style={props.style}>
    {
        new Array(props.size || 5).fill(undefined).map((_, i) => (
            <ListItem key={i} className={classNames('skeleton', props.itemClassName)} />
        ))
    }
    </List>
);

const scrollOptions: ScrollIntoViewOptions = { block: 'center' };
export const useScrollIntoSelectedElement = (deps: any[]) => {
    React.useEffect(
        () => {
            const selectedNode = document.querySelector('.timey-list-item.selected');
            if (selectedNode !== null) {
                selectedNode.scrollIntoView(scrollOptions);
            }
        },
        deps,
    );
};