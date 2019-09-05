import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Container } from 'components/container';
import { toISODate, tryParseDate, equalDate } from 'shared/date';
import { TimesheetEntry } from 'shared/types';

import { ActivityListContainer } from './activityList';
import { ActivityCalendar } from './activityCalendar';
import { HoursGaugeContaier } from './hoursGauge';


const onCalendarDayClick = (props: RouteComponentProps) => React.useCallback(
    (date: Date) => {
        const selectedDay = getDateFromQueryString();
        if (selectedDay !== undefined && equalDate(date, selectedDay)) {
            props.history.push(props.match.path);
        } else {
            props.history.push(`${props.match.path}?date=${toISODate(date)}`);
        }
    },
    [],
);

const gotoNewTimingPage = (props: RouteComponentProps) => React.useCallback(
    (date: Date) => props.history.push(`/time/new?date=${toISODate(date)}`),
    [],
);

const gotoEditTimingPage = (props: RouteComponentProps) => React.useCallback(
    (entry: TimesheetEntry) => props.history.push(`/time/${entry.id}`),
    [],
);

export type TimingsPageContainerProps = RouteComponentProps & {
    onDayChange?: (x: { date: Date, count: number }) => void,
};

export const ActivityOverviewPageContainer = (props: TimingsPageContainerProps) => {
    const date = getDateFromQueryString();

    return (
        <Container>
            <ActivityCalendar
                selectedDay={date}
                onSelectDay={onCalendarDayClick(props)}
                style={{ justifyContent: 'center', marginBottom: 40 }}
            />

            <HoursGaugeContaier />

            <ActivityListContainer
                date={date}
                onActivityAddClick={gotoNewTimingPage(props)}
                onActivityClick={gotoEditTimingPage(props)}
            />
        </Container>
    );
};



function getDateFromQueryString(): Date | undefined {
    const queryParams = new URLSearchParams(window.location.search);
    const dateParam = queryParams.get('date');
    return dateParam === null ? undefined : parseSelectedDate(dateParam);
}

function parseSelectedDate(str: string): Date {
    const date = tryParseDate(str);

    if (date === undefined) {
        console.error(`Unable to parse '${str}'. Showing default list view.`);
        return new Date();
    }

    return date;
}
