import { TimesheetEntry } from '../../shared/types';
import { ActivityListAction, ActivityListThunk } from './types';
import { EditTimingModalProps, CreateTimingModalProps } from '../../components/editTimingModal';

import { queryTimings } from '../../api/queryTimings';
import { addTimings } from '../../api/addTimings';
import { queryIssues } from '../../api/queryIssues';
import { updateTiming } from '../../api/updateTiming';
import { deleteTiming } from '../../api/deleteTiming';
import { QueryTimingsRequest } from '../../api/queryTimings/contract';


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



export const loadData = (req: QueryTimingsRequest): ActivityListThunk => (dispatch) => {
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
            enumerations: state.enumerations,
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
            enumerations: state.enumerations,
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