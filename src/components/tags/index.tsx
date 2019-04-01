import * as React from 'react';

type Tag = {
    name: string,
    color?: string,
    style?: React.CSSProperties,
};

export type TagsProps = {
    children: React.ReactNode,
    style?: React.CSSProperties,
};

export const TagList = (props: TagsProps) => (
    <ul style={{
        listStyleType: 'none',
        display: 'flex',
        padding: 0,
        ...props.style,
    }}>
        {props.children}
    </ul>
);

export const Tag = (props: Tag) => (
    <li style={{
        backgroundColor: props.color,
        fontSize: '10pt',
        padding: 3,
        border: '1px solid #eee',
        borderRadius: 5,
        marginRight: 5,
        ...props.style,
    }}>
        {props.name}
    </li>
);