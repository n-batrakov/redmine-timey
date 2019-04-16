import './index.css';
import * as React from 'react';
import { assertNever } from '../../shared';

const getBtnClass = ({ type, size }: ButtonProps) => {
    const getTypeClass = () => {
        switch (type) {
            case undefined:
            case 'default':
                return '';
            case 'primary':
            case 'submit':
                return 'btn-primary';
            case 'danger':
                return 'btn-danger';
            default:
                assertNever(type);
                return '';
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case undefined:
            case 'default':
                return '';
            case 'small':
                return 'btn-small';
            default:
                assertNever(size);
                return '';
        }
    };

    return `btn ${getTypeClass()} ${getSizeClass()}`;
};

export type ButtonProps = {
    value: React.ReactNode,
    onClick?: () => void,
    type?: 'default' | 'primary' | 'danger' | 'submit',
    size?: 'small' | 'default',
    style?: React.CSSProperties,
    tooltip?: string,
};
export const Button = (x: ButtonProps) => (
    <button
        className={getBtnClass(x)}
        type={x.type === 'submit' ? 'submit' : 'button'}
        onClick={x.onClick}
        style={x.style}
        title={x.tooltip}
    >
        {x.value}
    </button>
);