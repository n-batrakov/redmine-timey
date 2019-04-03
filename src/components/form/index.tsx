import * as React from 'react';
import { toISODate } from '../../shared/date';
import { assertNever } from '../../shared';
import './form.css';
import { Preloader } from '../preloader';

const getBtnTypeClass = ({ type }: ButtonProps) => {
    if (type === undefined) {
        return 'btn';
    }

    switch (type) {
        case 'default':
            return 'btn';
        case 'primary':
        case 'submit':
            return 'btn btn-primary';
        case 'danger':
            return 'btn btn-danger';
        default:
            assertNever(type);
    }
};

type FormControlProps = {
    name: string,
    label: string,
    required?: boolean,
    onChange?: (e: React.ChangeEvent) => void,
    style?: React.CSSProperties,
};

export type ButtonProps = {
    value: string,
    onClick?: () => void,
    type?: 'default' | 'primary' | 'danger' | 'submit',
    style?: React.CSSProperties,
};
export const Button = (x: ButtonProps) => (
    <button
        className={getBtnTypeClass(x)}
        type={x.type === 'submit' ? 'submit' : 'button'}
        onClick={x.onClick}
        style={x.style}
    >
        {x.value}
    </button>
);

export type TextInputProps = FormControlProps & {
    placeholder?: string,
    value?: string,
    disabled?: boolean,
};
export const TextInput = (x: TextInputProps) => (
    <div className="row">
        <label htmlFor={x.name}>{x.label}</label>
        <input
            type="text"
            defaultValue={x.value}
            name={x.name}
            placeholder={x.placeholder}
            disabled={x.disabled}
            onChange={x.onChange}
            style={x.style}
            required={x.required}
        />
    </div>
);

export type NumberInputProps = FormControlProps & {
    value?: number,
    disabled?: boolean,
    step?: number,
    min?: number,
    max?: number,
};
export const NumberInput = (x: NumberInputProps) => (
    <div className="row">
        <label htmlFor={x.name}>{x.label}</label>
        <input
            type="number"
            step={x.step}
            min={x.min}
            max={x.max}
            defaultValue={x.value === undefined ? undefined : x.value.toString()}
            name={x.name}
            disabled={x.disabled}
            onChange={x.onChange}
            style={x.style}
            required={x.required}
        />
    </div>
);

export const TextArea = (x: TextInputProps) => (
    <div className="row">
        <label htmlFor={x.name}>{x.label}</label>
        <textarea
            defaultValue={x.value}
            name={x.name}
            placeholder={x.placeholder}
            disabled={x.disabled}
            onChange={x.onChange}
            style={x.style}
            required={x.required}
        />
    </div>
);

export type SelectProps = FormControlProps & {
    children: React.ReactNode,
    value?: string,
    disabled?: boolean,
};
export const Select = (x: SelectProps) => (
    <div className="row">
        <label htmlFor={x.name}>{x.label}</label>
        <select
            name={x.name}
            defaultValue={x.value}
            onChange={x.onChange}
            style={x.style}
            disabled={x.disabled}
            required={x.required}
        >
            {x.children}
        </select>
    </div>
);
export const SelectOption = (x: { value: any, children: React.ReactNode }) => (
    <option value={x.value}>{x.children}</option>
);

export type DateInputProps = FormControlProps & {
    value?: Date,
    disabled?: boolean,
};
export const DateInput = (x: DateInputProps) => (
    <div className="row">
        <label htmlFor={x.name}>{x.label}</label>
        <input
            type="date"
            disabled={x.disabled}
            defaultValue={x.value === undefined ? undefined : toISODate(x.value)}
            name={x.name}
            onChange={x.onChange}
            style={x.style}
            required={x.required}
        />
    </div>
);

export const FormHeader = (x: {children: React.ReactNode}) => (
    <h2>{x.children}</h2>
);

export const FormFooter = (x: {children: React.ReactNode}) => (
    <div className="row footer">{x.children}</div>
);

export const FromErrors = ({ errors }: {errors: string[]}) => (
    <ul className="timey-form-errors" style={{ display: errors.length > 0 ? 'block' : 'none' }}>
        {errors.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
);

export type FormProps = {
    loading?: boolean,
    onSubmit: (x: any) => void,
};

export class Form extends React.Component<FormProps> {
    constructor(props: FormProps) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const form: any = {};
        formData.forEach((x, key) => form[key] = x);

        this.props.onSubmit(form);
    }

    public render() {
        return (
            <>
                <div className="timey-form-cover" style={{ display: this.props.loading ? 'block' : 'none' }}>
                    <Preloader active={this.props.loading || false } styles={{ marginTop: 0, top: '40%' }}/>
                </div>
                <form onSubmit={this.onSubmit} className="timey-form">
                    {this.props.children}
                </form>
             </>
        );
    }
}