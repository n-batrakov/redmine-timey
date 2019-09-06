import './index.scss';
import * as React from 'react';

export type ContainerProps = {
    inline?: boolean,
    children?: React.ReactNode,
    style?: React.CSSProperties,
};

export const Container = (props: ContainerProps) => (
    <div
        className={`timey-container ${props.inline ? 'inline' : ''}`}
        style={props.style}
    >
        {props.children}
    </div>
);