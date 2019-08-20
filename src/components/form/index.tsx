import './form.css';
import * as React from 'react';
import { CoverLoader } from '../preloader';
import { getFormData } from '../../shared/form';

type DefaultProps = {
    style?: React.CSSProperties,
    children?: React.ReactNode,
};


export type FormRowProps = DefaultProps & {
    floatRight?: boolean,
    inline?: boolean,
};

export const FormRow = (props: FormRowProps) => (
    <div className={`timey-form-row ${props.floatRight ? 'right' : ''} ${props.inline ? 'inline' : ''}`}>
        {props.children}
    </div>
);

export type FormProps<T> = DefaultProps & {
    loading?: boolean,
    onSubmit?: (x: T) => void,
};

// tslint:disable-next-line: function-name
export function Form<T = any>(props: FormProps<T>) {
    return (
        <>
            <CoverLoader active={props.loading || false } style={{ marginTop: 0, top: '40%' }}/>
            <form onSubmit={onSubmit(props)} className="timey-form" style={props.style}>
                {props.children}
            </form>
         </>
    );
};

function onSubmit<T>(props: FormProps<T>) {
    return React.useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (props.onSubmit === undefined) {
                return;
            }

            const form = getFormData<T>(e.target as HTMLFormElement);
            props.onSubmit(form);
        },
        [props.onSubmit],
    );
}