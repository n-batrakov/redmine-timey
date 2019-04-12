import * as React from 'react';
import * as Store from './actions';
import { connect } from 'react-redux';

import { TimesheetEntry } from '../../shared/types';
import { AppState } from '../../state';

import { ActivityList } from '../../components/activityList';
import { Preloader } from '../../components/preloader';
import {
    EditTimingModalProps,
    CreateTimingModalProps,
    EditTimingModal,
    CreateTimingModal,
} from '../../components/editTimingModal';
import { RouteComponentProps } from 'react-router';
import { tryParseDate, addDays, toISODate } from '../../shared/date';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import { NavLink } from 'react-router-dom';

type ActivityListContainerProps = {
    data: TimesheetEntry[],
    isLoading: boolean,
    editModal?: EditTimingModalProps,
    createModal?: CreateTimingModalProps,

    loadData: (req: {start: Date, end: Date}) => void,
    onActivityClick?: (entry: TimesheetEntry) => void,
    onActivityAddClick?: (date: Date) => void,
} & RouteComponentProps<{date?: string}>;

const getOverviewTimeframe = (end: Date) => {
    const start = addDays(end, -7);
    return { start, end };
};

const parseSelectedDate = (str: string) => {
    const date = tryParseDate(str);

    if (date === undefined) {
        console.error(`Unable to parse '${str}'. Showing default list view.`);
        return getOverviewTimeframe(new Date());
    }

    return { start: date, end: date };
};


const showIf = (condition: boolean): React.CSSProperties | undefined => condition ? undefined : { display: 'none' };
const hideIf = (condition: boolean): React.CSSProperties | undefined => showIf(!condition);

const List = (props: ActivityListContainerProps) => {
    const isDaySelected = props.match.params.date !== undefined;
    const timeframe = isDaySelected
        ? parseSelectedDate(props.match.params.date as string)
        : getOverviewTimeframe(new Date());

    React.useEffect(() => props.loadData(timeframe), [toISODate(timeframe.start), toISODate(timeframe.end)]);

    return (
        <>
            { props.editModal === undefined ? undefined : <EditTimingModal { ...props.editModal }/> }
            { props.createModal === undefined ? undefined : <CreateTimingModal { ...props.createModal }/> }
            <div className="activity-overview">
                <h1 style={{ display: 'flex' }}>
                    <Breadcrumbs>
                        <Crumb>
                            <NavLink to="/time" style={{ cursor: 'pointer', color: '#2261a1', textDecoration: 'none', outline: 0 }}>Activity Overview</NavLink>
                        </Crumb>
                        <Crumb style={showIf(isDaySelected)}>
                            {timeframe.start.toLocaleDateString()}
                        </Crumb>
                    </Breadcrumbs>
                </h1>

                <Preloader active={props.isLoading} />

                <div style={hideIf(props.isLoading)}>
                    <ActivityList {...props} {...timeframe} />
                </div>
            </div>
        </>
    );
};

export const ActivityListContainer = connect(
    (state: AppState, props: Partial<ActivityListContainerProps>): Partial<ActivityListContainerProps> => ({
        ...props,
        ...state.activityList,
    }),
    {
        loadData: Store.loadData,
        onActivityClick: Store.openEditModal,
        onActivityAddClick: Store.openAddModal,
    },
)(List);