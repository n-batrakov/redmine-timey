import './index.css';
import * as React from 'react';
import { toISODate } from '../../shared/date';


export const Label = (props: { label: string, children?: React.ReactNode}) => (
    <>
        {React.Children.map(props.children, (x: any) =>
            x.props === undefined || x.props.name === undefined
                ? x
                : (<><label className="timey-label" htmlFor={x.props.name}>{props.label}</label>{x}</>),
        )}
    </>
);

type FormControlProps = {
    name?: string,
    required?: boolean,
    onChange?: (e: React.ChangeEvent) => void,
    style?: React.CSSProperties,
};

export type TextInputProps = FormControlProps & {
    type?: 'text' | 'password',
    placeholder?: string,
    value?: string,
    disabled?: boolean,
    icon?: React.ReactNode,
};
export const TextInput = (x: TextInputProps) => (
    <div className="timey-input-container">
        <input
            className={`timey-input-text${x.icon === undefined ? '' : '-with-icon'}`}
            type={x.type || 'text'}
            defaultValue={x.value}
            name={x.name}
            placeholder={x.placeholder}
            disabled={x.disabled}
            onChange={x.onChange}
            style={x.style}
            required={x.required}
        />
        {
            x.icon === undefined
                ? undefined
                : <span className="timey-input-icon">{x.icon}</span>
        }
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
    <div className="timey-input-container">
        <input
            className="timey-input-number"
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
    <div className="timey-input-container">
        <textarea
            className="timey-input-textarea"
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
    children?: React.ReactNode,
    value?: string,
    disabled?: boolean,
};
export const Select = (x: SelectProps) => (
    <div className="timey-input-container">
        <select
            className="timey-input-select"
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
export const SelectOption = (x: { value?: any, children?: React.ReactNode }) => (
    <option value={x.value}>{x.children}</option>
);

export type DateInputProps = FormControlProps & {
    value?: Date,
    disabled?: boolean,
};
export const DateInput = (x: DateInputProps) => (
    <div className="timey-input-container">
        <input
            className="timey-input-date"
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