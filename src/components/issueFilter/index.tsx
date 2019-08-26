import './index.scss';
import * as React from 'react';
import { IconFilter, IconRefresh } from '../icon';
import { Button } from '../button';
import { Enumeration } from '../../shared/types';
import { EnumerationsState } from '../../store/enumerations/types';
import { Form, FormRow } from '../form';


const toOptions = (enumeration?: Enumeration) => {
    if (enumeration === undefined) {
        return null;
    }

    return [
        <option key="nil"></option>,
        ...Object.keys(enumeration.values).map(key => (
                <option key={key} value={key}>{enumeration.values[key]}</option>
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
                <select name="query" defaultValue={query}>{toOptions(enums.queries)}</select>
            </FormRow>
            <FormRow>
                <label htmlFor="project">Project</label>
                <select name="project" defaultValue={project}>{toOptions(enums.projects)}</select>
            </FormRow>
            <FormRow>
                <label htmlFor="status">Status</label>
                <select name="status" defaultValue={status}>{toOptions(enums.status)}</select>
            </FormRow>
            <FormRow>
                <label htmlFor="assigned">Assigned</label>
                <select name="assigned" defaultValue={assigned}>{toOptions(enums.users)}</select>
            </FormRow>
            <FormRow>
                <label htmlFor="author">Author</label>
                <select name="author" defaultValue={author}>{toOptions(enums.users)}</select>
            </FormRow>

            <FormRow floatRight inline>
                <Button type="reset" kind="danger" label="Reset" style={{ marginLeft: 0 }} />
                <label htmlFor="filter-toggle-input" className="btn">Cancel</label>
                <Button type="submit" kind="primary" label="Apply" />
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

            <div className="content">
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

            <div className="content">
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