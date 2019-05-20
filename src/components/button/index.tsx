import './index.css';
import * as React from 'react';
import { assertNever } from '../../shared';

const getBtnClass = ({ type, size, className }: ButtonProps) => {
    const getTypeClass = () => {
        switch (type) {
            case undefined:
            case 'default':
                return '';
            case 'primary':
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

    return `btn ${getTypeClass()} ${getSizeClass()} ${className}`;
};

export type ButtonProps = {
    value: React.ReactNode,
    onClick?: () => void,
    submit?: boolean,
    type?: 'default' | 'primary' | 'danger',
    size?: 'small' | 'default',
    style?: React.CSSProperties,
    tooltip?: string,
    disabled?: boolean,
    className?: string,
};
export const Button = (x: ButtonProps) => (
    <button
        className={getBtnClass(x)}
        type={x.submit === true ? 'submit' : 'button'}
        onClick={x.onClick}
        style={x.style}
        title={x.tooltip}
        disabled={x.disabled}
    >
        {x.value}
    </button>
);