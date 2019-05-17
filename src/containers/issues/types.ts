import { Issue } from '../../shared/types';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../state';

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
export type IssuesFilter = {
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
    filter?: IssuesFilter,
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
    filter?: IssuesFilter,
};

export type IssuesThunk = ThunkAction<void, AppState, {}, IssuesAction>;