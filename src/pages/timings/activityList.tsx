import * as React from 'react';
import { TimesheetEntry } from '../../shared/types';
import { addDays, toISODate } from '../../shared/date';
import { ActivityList } from '../../components/activityList';
import { Preloader } from '../../components/preloader';
import { queryTimings } from '../../api/queryTimings';
import { EditTimingModalProps, CreateTimingModalProps, EditTimingModal, CreateTimingModal } from '../../components/editTimingModal';
import { getEnumerations } from '../../api/getEnumerations';
import { updateTiming } from '../../api/updateTiming';
import { deleteTiming } from '../../api/deleteTiming';
import { assertNever } from '../../shared';
import { QueryTimingsRequest } from '../../api/queryTimings/contract';
import { queryIssues } from '../../api/queryIssues';
import { addTimings } from '../../api/addTimings';

type ActitityListState = {
    data: TimesheetEntry[],
    isLoading: boolean,
    editModal?: EditTimingModalProps,
    createModal?: CreateTimingModalProps,
};
type DispatchAction = {
    type: 'openEditModal',
    data: EditTimingModalProps,
} | {
    type: 'openCreateModal',
    data: CreateTimingModalProps,
} | {
    type: 'updateList',
    data: TimesheetEntry[],
} | {
    type: 'setPreloader',
} | {
    type: 'closeModal',
};
type DispatchFn = React.Dispatch<DispatchAction>;

const parseDate = (str?: string) => {
    if (str === undefined || str === null || str === '') {
        return undefined;
    }

    const dateNum = Date.parse(str);
    if (isNaN(dateNum)) {
        return undefined;
    }

    const date = new Date(dateNum);

    if (date.getFullYear() === NaN) {
        return undefined;
    }

    return date;
};

const reducer = (state: ActitityListState, action: DispatchAction): ActitityListState => {
    switch (action.type) {
        case 'closeModal':
            return { ...state, createModal: undefined, editModal: undefined };
        case 'openCreateModal':
            return { ...state, createModal: action.data };
        case 'openEditModal':
            return { ...state, editModal: action.data };
        case 'setPreloader':
            return { ...state, isLoading: true };
        case 'updateList':
            return { ...state, isLoading: false, data: action.data, createModal: undefined, editModal: undefined };
        default:
            assertNever(action);
            throw new Error('Unexpected action type');
    }
};

const onActivityClick = async (dispatch: DispatchFn, entry: TimesheetEntry, req: QueryTimingsRequest) => {
    const modalData: EditTimingModalProps = {
        opened: true,
        data: entry,
        onClose: () => dispatch({ type: 'closeModal' }),
        enumerations: await getEnumerations(),
        onUpdate: async (e, finish) => {
            await updateTiming(e);

            const { data } = await queryTimings(req);

            finish();

            dispatch({ data, type: 'updateList' });
        },
        onDelete: async (id, finish) => {
            await deleteTiming(id);

            const { data } = await queryTimings(req);

            finish();

            dispatch({ data, type: 'updateList' });
        },
    };

    dispatch({ type: 'openEditModal', data: modalData });
};

const onActivityAddClick = async (dispatch: DispatchFn, date: Date, req: QueryTimingsRequest) => {
    const createModal: CreateTimingModalProps = {
        opened: true,
        enumerations: await getEnumerations(),
        issueSource: queryIssues,
        defaultValue: {
            spentOn: date,
        },
        onCreate: async (entry, finish, setErrors) => {
            const [response] = await addTimings([entry]);
            if (response.code === 'Error') {
                setErrors(response.errors);
                return;
            }

            const { data } = await queryTimings(req);

            finish();

            dispatch({ data, type: 'updateList' });
        },
        onClose: () => {
            dispatch({ type: 'closeModal' });
        },
    };

    dispatch({ type: 'openCreateModal', data: createModal });
};



type StatefulActivityListProps = {
    date?: string,
};
export const StatefulActivityList = (props: StatefulActivityListProps) => {
    const now = new Date();
    const date = parseDate(props.date);
    const start = date || addDays(now, -7);
    const end = date || now;
    const timingsRequest = { start, end };

    const [state, dispatch] = React.useReducer(reducer, {
        data: [],
        isLoading: true,
        editModal: undefined,
        createModal: undefined,

    } as ActitityListState);

    React.useEffect(
        () => {
            dispatch({ type: 'setPreloader' });
            queryTimings(timingsRequest).then(({ data }) => {
                dispatch({ data, type: 'updateList' });
            });
        },
        [toISODate(start), toISODate(end)]);

    return (
        <>
            { state.editModal === undefined ? undefined : <EditTimingModal { ...state.editModal }/> }
            { state.createModal === undefined ? undefined : <CreateTimingModal { ...state.createModal }/> }
            <div className="activity-overview">
                <h1>{date === undefined ? 'Activity Overview' : date.toLocaleDateString()}</h1>
                <Preloader active={state.isLoading} />
                <div style={{ display: state.isLoading ? 'none' : undefined }}>
                    <ActivityList
                        data={state.data}
                        start={start}
                        end={end}
                        onActivityClick={entry => onActivityClick(dispatch, entry, timingsRequest)}
                        onActivityAddClick={date => onActivityAddClick(dispatch, date, timingsRequest)}
                    />
                </div>
            </div>
        </>
    );
};