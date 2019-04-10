import { TimesheetEntry } from '../../../shared/types';
import { EditTimingModalProps, CreateTimingModalProps } from '../../../components/editTimingModal';
import { queryTimings } from '../../../api/queryTimings';
import { addTimings } from '../../../api/addTimings';
import { ThunkAction } from 'redux-thunk';
import { Dispatch } from 'react';
import { TimingsPageState } from '../types';
import { getEnumerations } from '../../../api/getEnumerations';
import { queryIssues } from '../../../api/queryIssues';
import { updateTiming } from '../../../api/updateTiming';
import { deleteTiming } from '../../../api/deleteTiming';

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

export type ActivityListThunk = ThunkAction<any, TimingsPageState, {}, ActivityListAction>;

export type ActivityListDispatch = Dispatch<ActivityListAction | ActivityListThunk>;



export const closeModal = (): ActivityListAction => ({
    type: 'activityList_closeModal',
});

export const setPreloader = (isLoadging: boolean): ActivityListAction => ({
    type: 'activityList_setPreloader',
    isLoading: isLoadging,
});

export const setData = (data: TimesheetEntry[]): ActivityListAction => ({
    data,
    type: 'activityList_setReady',
});



export const loadData = (): ActivityListThunk => (dispatch, getState) => {
    const { activityList: req } = getState();

    queryTimings(req)
    .then(({ data }) => {
        dispatch({ data, type: 'activityList_setReady' });
    })
    .catch((e) => {
        console.error(e);
    });
};

export const openAddModal = (date: Date): ActivityListThunk =>
    async (dispatch, getState) => {
        const state = getState();
        const modal: CreateTimingModalProps = {
            opened: true,
            enumerations: await getEnumerations(),
            issueSource: queryIssues,
            defaultValue: {
                spentOn: date,
            },
            onClose: () => dispatch(closeModal()),
            onCreate: async (entry, finish, setErrors) => {
                const [response] = await addTimings([entry]);
                if (response.code === 'Error') {
                    setErrors(response.errors);
                    finish();
                } else {
                    const newEntry = response.entry;
                    const data = [newEntry, ...state.activityList.data];

                    dispatch({ data, type: 'activityList_setReady' });
                    dispatch(closeModal());
                }
            },
        };

        dispatch({ type: 'activityList_openCreateModal', data: modal });
    };

export const openEditModal = (entry: TimesheetEntry): ActivityListThunk =>
    async (dispatch, getState) => {
        const state = getState();
        const modal: EditTimingModalProps = {
            opened: true,
            data: entry,
            enumerations: await getEnumerations(),
            onClose: () => dispatch(closeModal()),
            onUpdate: async (entry, finish) => {
                await updateTiming(entry);

                const data = [
                    entry,
                    ...state.activityList.data.filter(x => x.id !== entry.id),
                ];

                dispatch(setData(data));
                dispatch(closeModal());
            },
            onDelete: async (id, finish) => {
                await deleteTiming(id);

                const data = state.activityList.data.filter(x => x.id !== id);

                dispatch(setData(data));
                dispatch(closeModal());
            },
        };

        dispatch({ type: 'activityList_openEditModal', data: modal });
    };