import { addDays } from '../../shared/date';
import { assertNever } from '../../shared';
import { ActivityListAction, ActivityListState } from './types';


const initState: ActivityListState = {
    isLoading: true,
    data: [],
    title: 'Activity Overview',
    start: addDays(new Date(), -7),
    end: new Date(),
};

export const reducer = (state: ActivityListState, action: ActivityListAction): ActivityListState => {
    if (state === undefined) return initState;

    switch (action.type) {
        case 'activityList_openCreateModal':
            return {
                ...state,
                createModal: action.data,
            };
        case 'activityList_openEditModal':
            return {
                ...state,
                editModal: action.data,
            };
        case 'activityList_closeModal':
            return {
                ...state,
                createModal: undefined,
                editModal: undefined,
            };
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
