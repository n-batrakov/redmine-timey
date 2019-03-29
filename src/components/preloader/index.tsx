import * as React from 'react';
import './preloader.css';

const getColor = (x: PreloaderProps) => {
    return x.color || 'rgba(0, 0, 0, 0.2)';
}

export type PreloaderProps = {
    active: boolean,
    size?: number,
    color?: string,
    spinnerColor?: string,
    styles?: React.CSSProperties,
};
export const Preloader = (x: PreloaderProps) => (
    <div
        className={`loader ${x.active ? '' : 'disabled'}`}
        style={{
            fontSize: x.size,
            borderTop: `3px solid ${getColor(x)}`,
            borderRight: `3px solid ${getColor(x)}`,
            borderBottom: `3px solid ${getColor(x)}`,
            borderLeft: `3px solid ${x.spinnerColor || '#2261a1'}`,
            ...x.styles,
        }}
    />
);