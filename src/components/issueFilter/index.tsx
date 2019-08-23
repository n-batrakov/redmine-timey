import './index.css';
import * as React from 'react';
import { IconFilter, IconRefresh } from '../icon';
import { Select, SelectOption } from '../input';
import { Button } from '../button';
import { Enumeration } from '../../shared/types';
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

export type IssueFilterForm = {
    query?: string,
    project?: string,
    status?: string,
    assigned?: string,
    author?: string,
};
export type IssueFilterProps = {
    opened?: boolean,
    inline?: boolean,
    filter?: IssueFilterForm,
    enums?: EnumerationsState,
    onSubmit?: (form: IssueFilterForm) => void,
};

export const IssueFilterForm = (props: IssueFilterProps) => {
    const enums = props.enums || {} as EnumerationsState;

    const { query, assigned, project, status, author } = props.filter || {} as IssueFilterForm;

    return (
        <Form<IssueFilterForm> onSubmit={props.onSubmit}>
            <FormRow>
                <label htmlFor="query">Query</label>
                <Select name="query" value={query}>{toOptions(enums.queries)}</Select>
            </FormRow>
            <FormRow>
                <label htmlFor="project">Project</label>
                <Select name="project" value={project}>{toOptions(enums.projects)}</Select>
            </FormRow>
            <FormRow>
                <label htmlFor="status">Status</label>
                <Select name="status" value={status}>{toOptions(enums.status)}</Select>
            </FormRow>
            <FormRow>
                <label htmlFor="assigned">Assigned</label>
                <Select name="assigned" value={assigned}>{toOptions(enums.users)}</Select>
            </FormRow>
            <FormRow>
                <label htmlFor="author">Author</label>
                <Select name="author" value={author}>{toOptions(enums.users)}</Select>
            </FormRow>

            <FormRow floatRight inline>
                <label htmlFor="filter-toggle-input" className="btn">Cancel</label>
                <Button submit type="primary" value="Apply" />
            </FormRow>
        </Form>
    );
};


export type IssueFilterContainerProps = {
    opened?: boolean,
    children?: React.ReactNode,
    onRefresh?: () => void,
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
            <button type="button" className="filter-toggle btn" onClick={props.onRefresh}>
                <IconRefresh />
            </button>
        </div>
    );
};