import './form.css';
import * as React from 'react';
import { CoverLoader } from '../preloader';
import { getFormData } from '../../shared/form';


export const FormHeader = (x: {children: React.ReactNode}) => (
    <h2 className="timey-form-header">{x.children}</h2>
);

export const FormFooter = (x: {children: React.ReactNode}) => (
    <div className="timey-form-footer">{x.children}</div>
);

export const FromErrors = ({ errors, style }: {errors: string[], style?: React.CSSProperties }) => (
    <ul className="timey-form-errors" style={{ display: errors.length > 0 ? 'block' : 'none', ...style }}>
        {errors.map((x, i) => <li key={i}>{x}</li>)}
    </ul>
);

export type FormProps = {
    loading?: boolean,
    onSubmit: (x: any) => void,
    style?: React.CSSProperties,
};

export class Form extends React.Component<FormProps> {
    constructor(props: FormProps) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit(e: any) {
        e.preventDefault();

        const form = getFormData(e.target);

        this.props.onSubmit(form);
    }

    public render() {
        return (
            <>
                <CoverLoader active={this.props.loading || false } style={{ marginTop: 0, top: '40%' }}/>
                <form onSubmit={this.onSubmit} className="timey-form" style={this.props.style}>
                    {this.props.children}
                </form>
             </>
        );
    }
}