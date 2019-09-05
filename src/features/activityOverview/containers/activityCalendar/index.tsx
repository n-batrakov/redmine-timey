import './index.scss';
import * as React from 'react';
import { Calendar } from 'components/calendar';
import classNames from 'classnames';
import { useAppState, useActions } from 'state';
import { selectDay, selectMonth, getDayKey } from 'features/activityOverview/state/calendar/actions';
import { CalendarState } from 'features/activityOverview/state/calendar/types';

export type ActivityCalendayProps = {
    selectedDay?: Date,
    onSelectDay?: (date: Date) => void,
    style?: React.CSSProperties,
};

export const ActivityCalendar = (props: ActivityCalendayProps) => {
    const state = useAppState(x => x.calendar);
    const actions = useActions({ selectDay, selectMonth });

    React.useEffect(
        () => {
            const now = new Date();
            actions.selectMonth(now.getFullYear(), now.getMonth());
        },
        [],
    );

    return (
        <Calendar
            year={state.year}
            month={state.month}
            selected={props.selectedDay}
            onSelect={props.onSelectDay}
            dayClassName={dayClassName(state)}
            onChange={(year, month) => actions.selectMonth(year, month)}
            style={props.style}
        />
    );
};


const colorThresholds: [number, number, string][] = [
    [0, 1, 'color-0'],
    [1, 4, 'color-1'],
    [4, 8, 'color-2'],
    [8, 8.01, 'color-3'],
    [8.01, 12, 'color-4'],
    [12, Infinity, 'color-warn'],
];
function dayClassName(state: CalendarState) {
    return React.useCallback(
        (date: Date) => {
            const count = state.data[getDayKey(date)] || 0;
            return classNames(
                'activity-calendar-day',
                threshold(colorThresholds, count),
            );
        },
        [state.data],
    );
}

function threshold<T>(map: Array<[number, number, T]>, value: number) {
    for (const [min, max, result] of map) {
        if (value >= min && value < max) {
            return result;
        }
    }
}