import { TimesheetEntry } from 'shared/types';
import { ActivityListAction, ActivityListThunk } from './types';

import { queryTimings } from '../../api/queryTimings';
import { QueryTimingsRequest } from '../../api/queryTimings/contract';

import { loadData as updateTimingsData } from '../timingList/actions';


export const setPreloader = (isLoadging: boolean): ActivityListAction => ({
    type: 'activityList_setPreloader',
    isLoading: isLoadging,
});

export const setData = (data: TimesheetEntry[]): ActivityListThunk => (dispatch) => {
    dispatch({ data, type: 'activityList_setReady' });

    dispatch(updateTimingsData());
};

export const loadData = (req: QueryTimingsRequest): ActivityListThunk =>
    async (dispatch) => {
        const { data } = await queryTimings(req);
        dispatch({ data, type: 'activityList_setReady' });
    };

export const addEntry = (entry: TimesheetEntry): ActivityListAction => ({
    type: 'activityList_addEntry',
    data: entry,
});

export const updateEntry = (entry: TimesheetEntry): ActivityListAction => ({
    type: 'activityList_updateEntry',
    data: entry,
});

export const deleteEntry = (entryId: string): ActivityListAction => ({
    entryId,
    type: 'activityList_removeEntry',
});
