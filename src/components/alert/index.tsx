import './index.scss';
import React from 'react';

export type AlertProps = { children?: React.ReactNode };

export const Alert = (props: AlertProps & { type: 'success' | 'info' | 'warning' | 'danger' }) => {
    if (props.children === undefined) {
        return null;
    }

    return (
        <div className={`alert ${props.type || 'info'}`}>
            {props.children}
        </div>
    );
};

export const Success = (props: AlertProps) => <Alert type="success" {...props} />;
export const Info = (props: AlertProps) => <Alert type="info" {...props} />;
export const Warning = (props: AlertProps) => <Alert type="warning" {...props} />;
export const Danger = (props: AlertProps) => <Alert type="danger" {...props} />;
