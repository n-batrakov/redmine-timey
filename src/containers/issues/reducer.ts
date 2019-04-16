import { IssuesState, IssuesAction } from './types';

const initState: IssuesState = {
    data: [],
    isLoading: true,
    page: 0,
    pageSize: 10,
    totalCount: 0,
}

export const reducer = (state: IssuesState, action: IssuesAction): IssuesState => {
    if (state === undefined) {
        return initState;
    }

    switch (action.type) {
        case 'issues_setData':
            return {
                ...state,
                data: action.data,
                totalCount: action.totalCount,
                isLoading: false,
            };
        case 'issues_setPage':
            return {
                ...state,
                page: action.page,
            };
        case 'issues_setPreloader':
            return {
                ...state,
                isLoading: true,
            };
        default:
            return state;
    }
};