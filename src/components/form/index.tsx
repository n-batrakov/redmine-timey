import './form.css';
import * as React from 'react';
import { Preloader } from '../preloader';


export const FormHeader = (x: {children: React.ReactNode}) => (
    <h2 className="timey-form-header">{x.children}</h2>
);

export const FormFooter = (x: {children: React.ReactNode}) => (
    <div className="timey-form-footer">{x.children}</div>
);

export const FromErrors = ({ errors }: {errors: string[]}) => (
    <ul className="timey-form-errors" style={{ display: errors.length > 0 ? 'block' : 'none' }}>
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

        const formData = new FormData(e.target);
        const form: any = {};
        formData.forEach((x, key) => {
            const value = form[key];
            if (value === undefined) {
                form[key] = x;
            } else if (Array.isArray(value)) {
                form[key] = [...value, x];
            } else {
                form[key] = [value, x];
            }
        });

        this.props.onSubmit(form);
    }

    public render() {
        return (
            <>
                <div className="timey-form-cover" style={{ display: this.props.loading ? 'block' : 'none' }}>
                    <Preloader active={this.props.loading || false } styles={{ marginTop: 0, top: '40%' }}/>
                </div>
                <form onSubmit={this.onSubmit} className="timey-form" style={this.props.style}>
                    {this.props.children}
                </form>
             </>
        );
    }
}