import { IssuesState, IssuesAction } from './types';

const initState: IssuesState = {
    data: [],
    isLoading: true,
    page: 0,
    pageSize: 10,
    totalCount: 0,
    filter: {
        assigned: { label: 'Me', value: 'me' },
    },
};

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
        case 'issues_setFilter':
            return {
                ...state,
                filter: action.filter,
            };
        default:
            return state;
    }
};