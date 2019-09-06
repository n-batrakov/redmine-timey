import './index.scss';
import * as React from 'react';
import { getFormData } from '../../shared/form';
import classNames from 'classnames';

type DefaultProps = {
    style?: React.CSSProperties,
    children?: React.ReactNode,
};


export type FormRowProps = DefaultProps & {
    floatRight?: boolean,
    inline?: boolean,
};

export const FormRow = (props: FormRowProps) => (
    <div
        className={classNames('timey-form-row', { right: props.floatRight, inline: props.inline })}
        style={props.style}
    >
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
            <form
                onSubmit={onSubmit(props)}
                className={classNames('timey-form', { loading: props.loading })}
                style={props.style}
            >
                {props.children}
            </form>
         </>
    );
}

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