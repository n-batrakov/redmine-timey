import * as React from 'react';
import * as Store from './store';
import { connect } from 'react-redux';
import { TimesheetEntry } from '../../shared/types';
import { ActivityList } from '../../components/activityList';
import { Preloader } from '../../components/preloader';
import { EditTimingModalProps, CreateTimingModalProps, EditTimingModal, CreateTimingModal } from '../../components/editTimingModal';
import { getEnumerations } from '../../api/getEnumerations';
import { queryIssues } from '../../api/queryIssues';

const onActivityClick =
    async (dispatch: Store.ActivityListDispatch, entry: TimesheetEntry) => {
        const modal: EditTimingModalProps = {
            opened: true,
            data: entry,
            onClose: () => dispatch(Store.closeModal()),
            enumerations: await getEnumerations(),
            onUpdate: async (e, finish) => {
                dispatch(Store.updateEntry(e));
            },
            onDelete: async (id, finish) => {
                dispatch(Store.deleteEntry(id));
            },
        };

        dispatch(Store.openEditModal(modal));
};

const onActivityAddClick =
    async (dispatch: Store.ActivityListDispatch, date: Date) => {
        const modal: CreateTimingModalProps = {
            opened: true,
            enumerations: await getEnumerations(),
            issueSource: queryIssues,
            defaultValue: {
                spentOn: date,
            },
            onCreate: async (entry, finish, setErrors) => {
                dispatch(Store.addEntry(entry));
            },
            onClose: () => {
                dispatch(Store.closeModal());
            },
        };

        dispatch(Store.openCreateModal(modal));
};

type ActivityListContainerProps = {
    title: string,
    start: Date,
    end: Date,
    data: TimesheetEntry[],
    isLoading: boolean,
    editModal?: EditTimingModalProps,
    createModal?: CreateTimingModalProps,
    dispatch: Store.ActivityListDispatch,
};

const List = (props: ActivityListContainerProps) => {
    React.useEffect(() => props.dispatch(Store.loadData()), []);

    return (
        <>
            { props.editModal === undefined ? undefined : <EditTimingModal { ...props.editModal }/> }
            { props.createModal === undefined ? undefined : <CreateTimingModal { ...props.createModal }/> }
            <div className="activity-overview">
                <h1>{props.title}</h1>
                <Preloader active={props.isLoading} />
                <div style={{ display: props.isLoading ? 'none' : undefined }}>
                    <ActivityList
                        data={props.data}
                        start={props.start}
                        end={props.end}
                        onActivityClick={x => onActivityClick(props.dispatch, x)}
                        onActivityAddClick={x => onActivityAddClick(props.dispatch, x)}
                    />
                </div>
            </div>
        </>
    );
};

export const ActivityListContainer = connect(
    (state: Store.TimingsPageState): Partial<ActivityListContainerProps> => ({
        ...state.activityList,
    }),
)(List);