import { TimesheetEntry } from '../../../shared/types';
import { EditTimingModalProps, CreateTimingModalProps } from '../../../components/editTimingModal';
import { queryTimings } from '../../../api/queryTimings';
import { ThunkAction } from 'redux-thunk';
import { Dispatch } from 'react';

export type TimingsPageState = {
    activityList: ActivityListState,
};

export type ActivityListState = {
    data: TimesheetEntry[],
    isLoading: boolean,
    title: string,
    start: Date,
    end: Date,
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
} | {
    type: 'activityList_load',
};

export type ActivityListThunk = ThunkAction<any, TimingsPageState, {}, ActivityListAction>;

export type ActivityListDispatch = Dispatch<ActivityListAction | ActivityListThunk>;




export const openEditModal = (data: EditTimingModalProps): ActivityListAction => ({
    data,
    type: 'activityList_openEditModal',
});

export const openCreateModal = (data: CreateTimingModalProps): ActivityListAction => ({
    data,
    type: 'activityList_openCreateModal',
});

export const closeModal = (): ActivityListAction => ({
    type: 'activityList_closeModal',
});

export const setPreloader = (isLoadging: boolean): ActivityListAction => ({
    type: 'activityList_setPreloader',
    isLoading: isLoadging,
});



export const loadData = (): ActivityListThunk => (dispatch, getState) => {
    const { activityList: req } = getState();

    queryTimings(req).then(({ data }) => {
        dispatch({ data, type: 'activityList_setReady' });
    });
};

export const addEntry = (entry: TimesheetEntry): ActivityListThunk =>
    (dispatch, getState) => {
        dispatch(setPreloader(true));

        const { activityList } = getState();

        const data = [entry, ...activityList.data];

        dispatch({ data, type: 'activityList_setReady' });
        dispatch(closeModal());
    };

export const updateEntry = (entry: TimesheetEntry): ActivityListThunk =>
    (dispatch, getState) => {
        dispatch(setPreloader(true));

        const { activityList } = getState();

        const data = [entry, ...activityList.data.filter(x => x.id !== entry.id)];

        dispatch({ data, type: 'activityList_setReady' });
        dispatch(closeModal());
    };

export const deleteEntry = (id: string): ActivityListThunk =>
    (dispatch, getState) => {
        dispatch(setPreloader(true));

        const { activityList } = getState();

        const data = activityList.data.filter(x => x.id !== id);

        dispatch({ data, type: 'activityList_setReady' });
        dispatch(closeModal());
    };