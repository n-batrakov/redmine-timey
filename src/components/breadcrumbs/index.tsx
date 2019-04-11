import * as React from 'react';
import './index.css';



export type CrumbProps = {
    className?: string,
    style?: React.CSSProperties,
    children?: React.ReactNode,
};
export const Crumb = (props: CrumbProps) => (<li {...props}>{props.children}</li>);

export type BreadcrumbsProps = {
    children?: React.ReactNode,
};
export const Breadcrumbs = (props: BreadcrumbsProps) => (
    <ul className="timey-breadcrumbs">
        {props.children}
    </ul>
);