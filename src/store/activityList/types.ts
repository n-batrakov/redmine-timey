import { Dispatch, Action } from 'redux';

import { TimesheetEntry } from '../../shared/types';
import { EditTimingModalProps, CreateTimingModalProps } from '../../components/editTimingModal';
import { AppState } from '..';
import { ThunkAction } from '../thunk';

export type ActivityListState = {
    data: TimesheetEntry[],
    isLoading: boolean,
    editModal?: EditTimingModalProps,
    createModal?: CreateTimingModalProps,
};

export type ActivityListAction = {
    type: 'activityList_openEditModal',
    data: EditTimingModalProps,
} | {
    type: 'activityList_openCreateModal',
    data: CreateTimingModalProps,
} | {
    type: 'activityList_closeModal',
} | {
    type: 'activityList_setPreloader',
    isLoading: boolean,
} | {
    type: 'activityList_setReady',
    data: TimesheetEntry[],
};

export type ActivityListThunk = ThunkAction<any, AppState, {}, ActivityListAction>;

export type ActivityListDispatch = Dispatch<Action<ActivityListAction | ActivityListThunk>>;