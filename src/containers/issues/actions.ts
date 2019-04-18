import { Issue } from '../../shared/types';
import { queryIssues } from '../../api/queryIssues';
import { IssuesAction, IssuesThunk } from './types';


export const setPreloader = (): IssuesAction => ({
    type: 'issues_setPreloader',
});

export const setData = (data: Issue[], totalCount: number): IssuesAction => ({
    data,
    totalCount,
    type: 'issues_setData',
});

export const loadData = (page: number): IssuesThunk => (dispatch, getState) => {
    const pageSize = getState().issues.pageSize;
    const limit = pageSize;
    const offset = page * pageSize;

    queryIssues({ limit, offset })
    .then(({ data, totalCount }) => {
        dispatch(setData(data, totalCount));
    })
    .catch((e) => {
        console.error(e);
    });
};