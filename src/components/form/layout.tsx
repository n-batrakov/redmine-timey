import './layout.css';
import * as React from 'react';


export const Row = ({ children }: {children?: React.ReactNode}) => (
    <div className="row">{children}</div>
);

export const Column = ({ children }: {children?: React.ReactNode}) => (
    <div className="col">{children}</div>
);

export const VerticalLayout = ({ children }: {children?: React.ReactNode}) => (
    <div className="timey-layout timey-layout-vertical">{children}</div>
);