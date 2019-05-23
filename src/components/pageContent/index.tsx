import './index.css';
import * as React from 'react';

export const PageContent = ({ children }: { children?: React.ReactNode}) => (
    <div className="timey-page-content">{children}</div>
);