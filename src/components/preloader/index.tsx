import './index.scss';
import * as React from 'react';

const getColor = (x: LoaderProps) => {
    return x.color || 'rgba(0, 0, 0, 0.2)';
};

export type LoaderProps = {
    active: boolean,
    size?: number,
    color?: string,
    spinnerColor?: string,
    style?: React.CSSProperties,
};
export const Loader = React.memo((x: LoaderProps) => (
    <div
        className={`timey-loader ${x.active ? '' : 'disabled'}`}
        style={{
            fontSize: x.size,
            borderTop: `3px solid ${getColor(x)}`,
            borderRight: `3px solid ${getColor(x)}`,
            borderBottom: `3px solid ${getColor(x)}`,
            borderLeft: `3px solid ${x.spinnerColor || '#2261a1'}`,
            ...x.style,
        }}
    />
));


export const LoaderBackground = (props: { style?: React.CSSProperties, children?: React.ReactNode}) => (
    <div className="timey-loader-cover" style={props.style}>{props.children}</div>
);

export const CoverLoader = React.memo((props: LoaderProps) => (
    <LoaderBackground style={{ display: props.active ? undefined : 'none' }}>
        <Loader {...props} active style={{ margin: 'auto', ...props.style }}/>
    </LoaderBackground>
));