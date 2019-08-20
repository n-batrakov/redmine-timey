import './index.css';
import * as React from 'react';
import { toISODate } from '../../shared/date';


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
};
export const TextInput = (x: TextInputProps) => (
    <input
        type={x.type || 'text'}
        defaultValue={x.value}
        name={x.name}
        placeholder={x.placeholder}
        disabled={x.disabled}
        onChange={x.onChange}
        style={x.style}
        required={x.required}
    />
);

export type NumberInputProps = FormControlProps & {
    value?: number,
    disabled?: boolean,
    step?: number,
    min?: number,
    max?: number,
};
export const NumberInput = (x: NumberInputProps) => (
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
);

export const TextArea = (x: TextInputProps) => (
    <textarea
        defaultValue={x.value}
        name={x.name}
        placeholder={x.placeholder}
        disabled={x.disabled}
        onChange={x.onChange}
        style={x.style}
        required={x.required}
    />
);

export type SelectProps = FormControlProps & {
    children?: React.ReactNode,
    value?: string,
    disabled?: boolean,
};
export const Select = (x: SelectProps) => (
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
);
export const SelectOption = (x: { value?: any, children?: React.ReactNode }) => (
    <option value={x.value}>{x.children}</option>
);

export type DateInputProps = FormControlProps & {
    value?: Date,
    disabled?: boolean,
};
export const DateInput = (x: DateInputProps) => (
    <input
        type="date"
        disabled={x.disabled}
        defaultValue={x.value === undefined ? undefined : toISODate(x.value)}
        name={x.name}
        onChange={x.onChange}
        style={x.style}
        required={x.required}
    />
);