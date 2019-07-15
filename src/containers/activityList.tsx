import * as React from 'react';
import * as Store from '../store/activityList/actions';
import { connect } from 'react-redux';

import { TimesheetEntry } from '../shared/types';
import { AppState } from '../store';

import { ActivityList } from '../components/activityList';
import { Loader } from '../components/preloader';
import { addDays, toISODate } from '../shared/date';
import { ActivityListHeader } from '../components/activityList/header';

type ActivityListContainerProps = {
    date?: Date,
    data: TimesheetEntry[],
    isLoading: boolean,

    loadData: (req: {start: Date, end: Date}) => void,

    onActivityClick?: (x: TimesheetEntry) => void,
    onActivityAddClick?: (date: Date) => void,
};

const getOverviewTimeframe = (end: Date) => {
    const start = addDays(end, -7);
    return { start, end };
};

const hideIf = (condition: boolean): React.CSSProperties | undefined => condition ? { display: 'none' } : undefined;

const List = (props: ActivityListContainerProps) => {
    const isDaySelected = props.date !== undefined;
    const timeframe = isDaySelected
        ? { start: props.date!, end: props.date! }
        : getOverviewTimeframe(new Date());

    React.useEffect(() => { props.loadData(timeframe); }, [toISODate(timeframe.start), toISODate(timeframe.end)]);

    return (
        <>
            <div className="activity-overview">
                <ActivityListHeader date={isDaySelected ? timeframe.start : undefined} />
                <Loader active={props.isLoading} />

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
    },
)(List);