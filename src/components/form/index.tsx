import * as React from 'react';
import { toISODate } from '../../shared/date';
import './form.css';

const getBtnTypeClass = (type?: string) =>
    type === undefined ? 'btn' : `btn btn-${type}`;

type FormControlProps = {
    name: string,
    label: string,
    onChange?: (e: React.ChangeEvent) => void,
    style?: React.CSSProperties,
};

export type ButtonProps = {
    value: string,
    onClick?: () => void,
    type?: 'primary' | 'danger',
    style?: React.CSSProperties,
};
export const Button = (x: ButtonProps) => (
    <button
        className={getBtnTypeClass(x.type)}
        onClick={x.onClick}
        style={x.style}
    >
        {x.value}
    </button>
);

export const Submit = (x: ButtonProps) => (
    <input
        className={getBtnTypeClass(x.type)}
        onClick={x.onClick}
        type="submit"
        value={x.value}
        style={x.style}
    />
);

export type TextInputProps = FormControlProps & {
    placeholder?: string,
    value?: string,
    disabled?: boolean,
};
export const TextInput = (x: TextInputProps) => (
    <div className="row">
        <div className="col-25">
            <label htmlFor={x.name}>{x.label}</label>
        </div>
        <div className="col-75">
            <input
                type="text"
                defaultValue={x.value}
                name={x.name}
                placeholder={x.placeholder}
                disabled={x.disabled}
                onChange={x.onChange}
                style={x.style}
            />
        </div>
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
        <div className="col-25">
            <label htmlFor={x.name}>{x.label}</label>
        </div>
        <div className="col-75">
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
            />
        </div>
    </div>
);

export const TextArea = (x: TextInputProps) => (
    <div className="row">
        <div className="col-25"><label htmlFor={x.name}>{x.label}</label></div>
        <div className="col-75">
            <textarea
                defaultValue={x.value}
                name={x.name}
                placeholder={x.placeholder}
                disabled={x.disabled}
                onChange={x.onChange}
                style={x.style}
            />
        </div>
    </div>
);

export type SelectProps = FormControlProps & {
    children: React.ReactNode,
    value?: string,
    disabled?: boolean,
};
export const Select = (x: SelectProps) => (
    <div className="row">
        <div className="col-25"><label htmlFor={x.name}>{x.label}</label></div>
        <div className="col-75">
            <select
                name={x.name}
                defaultValue={x.value}
                onChange={x.onChange}
                style={x.style}
                disabled={x.disabled}
            >
                {x.children}
            </select>
        </div>
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
        <div className="col-25"><label htmlFor={x.name}>{x.label}</label></div>
        <div className="col-75">
            <input
                type="date"
                disabled={x.disabled}
                defaultValue={x.value === undefined ? undefined : toISODate(x.value)}
                name={x.name}
                onChange={x.onChange}
                style={x.style}
            />
        </div>
    </div>
);

export const FormHeader = (x: {children: React.ReactNode}) => (<h2>{x.children}</h2>);
export const FormFooter = (x: {children: React.ReactNode}) => (<div className="row footer">{x.children}</div>);

export type FormProps = {
    onSubmit: (x: FormState) => void,
    children: React.ReactNode,
};
type FormState = {
    [input: string]: any,
};
export class Form extends React.Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);

        const state: any = {};
        React.Children.forEach(props.children, (x: any) => {
            const name:string = x.props.name;
            const value: any = x.props.value;

            if (name && value) {
                state[name] = value;
            }
        });

        this.state = state;
    }

    private onSubmit(e: any) {
        e.preventDefault();

        this.props.onSubmit(this.state);
    }

    private onChange(e: any) {
        const name:string = e.target.name;
        const value = e.target.value;

        this.setState({ [name]: value });
    }

    public render() {
        const children = React.Children.map(this.props.children, (child: any) =>
            React.cloneElement(child, { onChange: this.onChange }));

        return (
            <form onSubmit={this.onSubmit} className="timey-form">
                {children}
            </form>
        );
    }
}