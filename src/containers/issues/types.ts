import { Issue } from '../../shared/types';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../state';

export type IssuesState = {
    isLoading: boolean,
    page: number,
    pageSize: number,
    totalCount: number,
    data: Issue[],
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
};

export type IssuesThunk = ThunkAction<void, AppState, {}, IssuesAction>;