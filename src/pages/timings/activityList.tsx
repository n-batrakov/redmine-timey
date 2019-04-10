import * as React from 'react';
import * as Store from './store';
import { connect } from 'react-redux';

import { TimingsPageState } from './types';
import { TimesheetEntry } from '../../shared/types';

import { ActivityList } from '../../components/activityList';
import { Preloader } from '../../components/preloader';
import { EditTimingModalProps, CreateTimingModalProps, EditTimingModal, CreateTimingModal } from '../../components/editTimingModal';

type ActivityListContainerProps = {
    title: string,
    start: Date,
    end: Date,
    data: TimesheetEntry[],
    isLoading: boolean,
    editModal?: EditTimingModalProps,
    createModal?: CreateTimingModalProps,

    loadData: () => void,
    onActivityClick?: (entry: TimesheetEntry) => void,
    onActivityAddClick?: (date: Date) => void,
};

const List = (props: ActivityListContainerProps) => {
    React.useEffect(() => props.loadData(), []);

    return (
        <>
            { props.editModal === undefined ? undefined : <EditTimingModal { ...props.editModal }/> }
            { props.createModal === undefined ? undefined : <CreateTimingModal { ...props.createModal }/> }
            <div className="activity-overview">
                <h1>{props.title}</h1>
                <Preloader active={props.isLoading} />
                <div style={{ display: props.isLoading ? 'none' : undefined }}>
                    <ActivityList {...props}/>
                </div>
            </div>
        </>
    );
};

export const ActivityListContainer = connect(
    (state: TimingsPageState): Partial<ActivityListContainerProps> => ({
        ...state.activityList,
    }),
    {
        loadData: Store.loadData,
        onActivityClick: Store.openEditModal,
        onActivityAddClick: Store.openAddModal,
    },
)(List);