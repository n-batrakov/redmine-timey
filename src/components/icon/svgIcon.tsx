import './index.scss';
import * as React from 'react';

export type IconProps = {
    style?: React.CSSProperties,
};

const svgProps: any = {
    'aria-hidden': 'true',
    'data-prefix': 'fas',
    focusable: 'false',
    role: 'img',
    xmlns: 'http://www.w3.org/2000/svg',
};

export const SvgIcon = (props: { viewBox: string, children?: React.ReactNode, style?: React.CSSProperties }) => (
    <svg
        className="icon"
        style={props.style}
        viewBox={props.viewBox}
        {...svgProps}
    >
        {props.children}
    </svg>
);