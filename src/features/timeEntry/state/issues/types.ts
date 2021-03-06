import { Issue } from 'shared/types';
import { AppState, ThunkAction } from 'state';

export type IssueFilterValue = {
    status?: string,
    project?: string,
    author?: string,
    assigned?: string,
    query?: string,
};

export type IssueFilterField = {
    label: string,
    value: string,
};
export type IssueFilter = {
    status?: IssueFilterField,
    project?: IssueFilterField,
    author?: IssueFilterField,
    assigned?: IssueFilterField,
    query?: IssueFilterField,
};

export type IssuesState = {
    isLoading: boolean,
    page: number,
    pageSize: number,
    totalCount: number,
    data: Issue[],
    filter?: IssueFilter,
};

export type IssuesAction = {
    type: 'issues_setPreloader',
} | {
    type: 'issues_setData',
    data: Issue[],
    totalCount: number,
} | {
    type: 'issues_setPage',
    page: number,
} | {
    type: 'issues_setFilter',
    filter?: IssueFilter,
} | {
    type: 'issues_reset',
};

export type IssuesThunk = ThunkAction<void, AppState, {}, IssuesAction>;