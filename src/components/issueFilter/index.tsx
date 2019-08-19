import './index.css';
import * as React from 'react';
import { IconFilter } from '../icon';
import { Select, SelectOption } from '../input';
import { Button } from '../button';
import { Enumeration } from '../../shared/types';
import { getFormData } from '../../shared/form';
import { EnumerationsState } from '../../store/enumerations/types';


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
    children?: React.ReactNode
};

export const IssueFilterForm = (props: IssueFilterProps) => {
    const enums = props.enums || {} as EnumerationsState;

    return (
        <form className="filter-form" onSubmit={onSubmit(props)}>
            <div className="issue-filter-row">
                <label htmlFor="query">Query</label>
                <Select name="query">{toOptions(enums.queries)}</Select>
            </div>
            <div className="issue-filter-row">
                <label htmlFor="project">Project</label>
                <Select name="project">{toOptions(enums.projects)}</Select>
            </div>
            <div className="issue-filter-row">
                <label htmlFor="status">Status</label>
                <Select name="status">{toOptions(enums.status)}</Select>
            </div>
            <div className="issue-filter-row">
                <label htmlFor="assigned">Assigned</label>
                <Select name="assigned">{toOptions(enums.users)}</Select>
            </div>
            <div className="issue-filter-row">
                <label htmlFor="author">Author</label>
                <Select name="author">{toOptions(enums.users)}</Select>
            </div>

            <div className="issue-filter-row right">
                <label htmlFor="filter-toggle-input" className="btn">Cancel</label>
                <Button submit type="primary" value="Apply" />
            </div>
        </form>
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

            {props.children}
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

            {props.children}

            <label className="filter-toggle btn" htmlFor="filter-toggle-input" >
                <IconFilter />
            </label>
        </div>
    );
};