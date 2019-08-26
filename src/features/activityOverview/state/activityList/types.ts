import { Dispatch, Action } from 'redux';

import { TimesheetEntry } from 'shared/types';
import { AppState } from 'state';
import { ThunkAction } from 'state/thunk';

export type ActivityListState = {
    data: TimesheetEntry[],
    isLoading: boolean,
};

export type ActivityListAction = {
    type: 'activityList_setPreloader',
    isLoading: boolean,
} | {
    type: 'activityList_setReady',
    data: TimesheetEntry[],
} | {
    type: 'activityList_addEntry',
    data: TimesheetEntry,
} | {
    type: 'activityList_updateEntry',
    data: TimesheetEntry,
} | {
    type: 'activityList_removeEntry',
    entryId: string,
};

export type ActivityListThunk = ThunkAction<any, AppState, {}, ActivityListAction>;

export type ActivityListDispatch = Dispatch<Action<ActivityListAction | ActivityListThunk>>;