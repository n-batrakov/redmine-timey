import * as React from 'react';

import { Loader } from 'components/preloader';
import { addDays, toISODate } from 'shared/date';
import { TimesheetEntry } from 'shared/types';
import { useAppState } from 'state';

import { loadTimingList } from '../state/activityList/actions';
import { ActivityListHeader } from '../components/activityList/header';
import { ActivityList } from '../components/activityList';
import { useActions } from 'hooks';

type ActivityListContainerProps = {
    date?: Date,
    onActivityClick?: (x: TimesheetEntry) => void,
    onActivityAddClick?: (date: Date) => void,
};

const getOverviewTimeframe = (end: Date) => {
    const start = addDays(end, -7);
    return { start, end };
};

export const ActivityListContainer = (props: ActivityListContainerProps) => {
    const isDaySelected = props.date !== undefined;
    const timeframe = isDaySelected
        ? { start: props.date!, end: props.date! }
        : getOverviewTimeframe(new Date());

    React.useEffect(() => { loadData(timeframe); }, [toISODate(timeframe.start), toISODate(timeframe.end)]);
    const state = useAppState(x => x.activityList);
    const loadData = useActions(loadTimingList);

    return (
        <>
            <div className="activity-overview" style={{ width: 800 }}>
                <ActivityListHeader date={isDaySelected ? timeframe.start : undefined} />
                <Loader active={state.isLoading} />

                <div style={state.isLoading ? { display: 'none' } : undefined}>
                    <ActivityList
                        start={timeframe.start}
                        end={timeframe.end}
                        data={state.data}
                        onActivityClick={props.onActivityClick}
                        onActivityAddClick={props.onActivityAddClick}
                    />
                </div>
            </div>
        </>
    );
};
