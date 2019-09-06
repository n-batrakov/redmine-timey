import './index.scss';
import * as React from 'react';

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