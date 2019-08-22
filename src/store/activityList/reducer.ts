import { assertNever } from '../../shared';
import { ActivityListAction, ActivityListState } from './types';


export const initState: ActivityListState = {
    isLoading: true,
    data: [],
};

export const reducer = (state: ActivityListState, action: ActivityListAction): ActivityListState => {
    if (state === undefined) return initState;

    switch (action.type) {
        case 'activityList_setPreloader':
            return {
                ...state,
                isLoading: action.isLoading,
            };
        case 'activityList_setReady':
            return {
                ...state,
                data: action.data,
                isLoading: false,
            };
        case 'activityList_addEntry':
            return {
                ...state,
                data: [action.data, ...state.data],
            };
        case 'activityList_updateEntry':
            return {
                ...state,
                data: replaceFirst(state.data, x => x.id === action.data.id, action.data),
            };
        case 'activityList_removeEntry':
            return {
                ...state,
                data: state.data.filter(x => x.id !== action.entryId),
            };
        default:
            assertNever(action);
            return state;
    }
};

function replaceFirst<T>(source: Array<T>, predicate: (e: T) => boolean, newValue: T) {
    const idx = source.findIndex(predicate);
    if (idx === -1) return source;

    return [
        ...source.slice(0, idx),
        newValue,
        ...source.slice(idx + 1),
    ];
}