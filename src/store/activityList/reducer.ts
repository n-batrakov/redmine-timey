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
        default:
            assertNever(action);
            return state;
    }
};
