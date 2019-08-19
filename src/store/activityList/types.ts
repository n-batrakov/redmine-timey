import { Dispatch, Action } from 'redux';

import { TimesheetEntry } from '../../shared/types';
import { AppState } from '..';
import { ThunkAction } from '../thunk';

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
};

export type ActivityListThunk = ThunkAction<any, AppState, {}, ActivityListAction>;

export type ActivityListDispatch = Dispatch<Action<ActivityListAction | ActivityListThunk>>;