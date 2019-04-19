import { Issue, EnumerationsLookup, Enumeration } from '../../shared/types';
import { queryIssues } from '../../api/queryIssues';
import { IssuesAction, IssuesThunk, IssuesFilter, IssueFilterValue } from './types';


export const setPreloader = (): IssuesAction => ({
    type: 'issues_setPreloader',
});

export const setData = (data: Issue[], totalCount: number): IssuesAction => ({
    data,
    totalCount,
    type: 'issues_setData',
});


export const gotoPage = (page: number): IssuesThunk => (dispatch) => {
    dispatch({ page, type: 'issues_setPage' });
    dispatch(loadData());
};


const mapFilter = (enums: EnumerationsLookup, filter: IssueFilterValue): IssuesFilter => {
    const find = (arr: Enumeration, value: string | undefined) => {
        if (value === undefined) {
            return undefined;
        }

        const label = arr.values[value];
        return label === undefined ? undefined : { value, label };
    };

    return {
        assigned: find(enums.users, filter.assigned),
        author: find(enums.users, filter.author),
        project: find(enums.projects, filter.project),
        query: find(enums.queries, filter.query),
        status: find(enums.status, filter.status),
    };
};
export const applyFilter = (filter?: IssueFilterValue): IssuesThunk => (dispatch, getState) => {
    const enumerations = getState().enumerations;
    dispatch({
        type: 'issues_setFilter',
        filter: filter === undefined ? undefined : mapFilter(enumerations, filter),
    });
    dispatch(loadData());
};

const mapFilterToApi = (x: IssuesFilter) => {
    return Object.entries(x).reduce<any>(
        (acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value.value;
            }
            return acc;
        },
        {});
};
export const loadData = (): IssuesThunk => (dispatch, getState) => {
    dispatch(setPreloader());
    
    const { page, pageSize, filter } = getState().issues;
    const limit = pageSize;
    const offset = page * pageSize;

    const queryFilter = filter === undefined ? undefined : mapFilterToApi(filter);

    queryIssues({ limit, offset, ...queryFilter })
    .then(({ data, totalCount }) => {
        dispatch(setData(data, totalCount));
    })
    .catch((e) => {
        console.error(e);
    });
};