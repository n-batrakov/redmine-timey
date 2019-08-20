import './index.css';
import * as React from 'react';
import { IconFilter } from '../icon';
import { Select, SelectOption } from '../input';
import { Button } from '../button';
import { Enumeration } from '../../shared/types';
import { getFormData } from '../../shared/form';
import { EnumerationsState } from '../../store/enumerations/types';
import { Form, FormRow } from '../form';


const toOptions = (enumeration?: Enumeration) => {
    if (enumeration === undefined) {
        return null;
    }

    return [
        <SelectOption key="nil"/>,
        ...Object.keys(enumeration.values).map(key => (
                <SelectOption key={key} value={key}>{enumeration.values[key]}</SelectOption>
            ),
        ),
    ];
};

const onSubmit = (props: IssueFilterProps) => React.useCallback(
    (e: React.FormEvent) => {
        e.preventDefault();

        if (props.onSubmit === undefined) {
            return;
        }

        const form = getFormData<IssueFilterForm>(e.target as HTMLFormElement);

        props.onSubmit(form);
    },
    [props.onSubmit],
);


export type IssueFilterForm = {
    query?: string,
    project?: string,
    status?: string,
    assigned?: string,
};
export type IssueFilterProps = {
    opened?: boolean,
    inline?: boolean,
    enums?: EnumerationsState,
    onSubmit?: (form: IssueFilterForm) => void,
};
export type IssueFilterContainerProps = {
    opened?: boolean,
    children?: React.ReactNode,
};

export const IssueFilterForm = (props: IssueFilterProps) => {
    const enums = props.enums || {} as EnumerationsState;

    return (
        <Form<IssueFilterForm> onSubmit={props.onSubmit}>
            <FormRow>
                <label htmlFor="query">Query</label>
                <Select name="query">{toOptions(enums.queries)}</Select>
            </FormRow>
            <FormRow>
                <label htmlFor="project">Project</label>
                <Select name="project">{toOptions(enums.projects)}</Select>
            </FormRow>
            <FormRow>
                <label htmlFor="status">Status</label>
                <Select name="status">{toOptions(enums.status)}</Select>
            </FormRow>
            <FormRow>
                <label htmlFor="assigned">Assigned</label>
                <Select name="assigned">{toOptions(enums.users)}</Select>
            </FormRow>
            <FormRow>
                <label htmlFor="author">Author</label>
                <Select name="author">{toOptions(enums.users)}</Select>
            </FormRow>

            <FormRow floatRight inline>
                <label htmlFor="filter-toggle-input" className="btn">Cancel</label>
                <Button submit type="primary" value="Apply" />
            </FormRow>
        </Form>
    );
};

export const ToggledIssueFilter = (props: IssueFilterContainerProps) => {
    return (
        <div className="issue-filter togglable">
            <input
                type="checkbox"
                id="filter-toggle-input"
                className="filter-toggle-input"
                defaultChecked={props.opened}
            />
            <label className="filter-toggle btn" htmlFor="filter-toggle-input" >
                Filters <IconFilter />
            </label>

            <div className="issue-filter-content">
                {props.children}
            </div>
        </div>
    );
};

export const OverflowIssueFilter = (props: IssueFilterContainerProps) => {
    return (
        <div className="issue-filter overflow">
            <input
                type="checkbox"
                id="filter-toggle-input"
                className="filter-toggle-input"
                defaultChecked={props.opened}
            />

            <div className="issue-filter-content">
                {props.children}
            </div>

            <label className="filter-toggle btn" htmlFor="filter-toggle-input" >
                <IconFilter />
            </label>
        </div>
    );
};