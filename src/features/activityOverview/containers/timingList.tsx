import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Container } from 'components/container';
import { MobileScreen, MobileScreenHidden } from 'components/mediaQuery';
import { addDays, toISODate, tryParseDate } from 'shared/date';
import { TimesheetEntry } from 'shared/types';
import { useAppState, useActions } from 'state';

import { ActivityListContainer } from './activityList';
import { ActivityHeatmap } from '../components/activityHeatmap';
import { HoursGauge } from '../components/hoursGauge';
import { loadTimingPageData } from '../state/timingList/actions';


const gotoDayOverviewPage = (props: RouteComponentProps) => React.useCallback(
    (x: { date: Date }) => props.history.push(`${props.match.path}?date=${toISODate(x.date)}`),
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

export const TimingsPageContainer = (props: TimingsPageContainerProps) => {
    const state = useAppState(x => x.timingsPage);
    const loadData = useActions(loadTimingPageData);

    React.useEffect(() => { loadData(); }, []);

    const today = new Date();
    const heatmapProps = {
        data: state.heatmap === undefined ? [] : state.heatmap.data,
        loading: state.isLoading,
        endDate: today,
        onClick: gotoDayOverviewPage(props),
    };
    const gaugeProps = state.gauge || { actualValue: 0, expectedValue: 160 };

    const queryParams = new URLSearchParams(props.location.search);
    const dateParam = queryParams.get('date');
    const date = dateParam === null ? undefined : parseSelectedDate(dateParam);

    return (
        <Container>
            <MobileScreen>
                <ActivityHeatmap {...heatmapProps} startDate={addDays(today, -120)} />
            </MobileScreen>
            <MobileScreenHidden>
                <ActivityHeatmap {...heatmapProps} startDate={addDays(today, -365)} />
            </MobileScreenHidden>

            <HoursGauge {...gaugeProps}/>

            <ActivityListContainer
                date={date}
                onActivityAddClick={gotoNewTimingPage(props)}
                onActivityClick={gotoEditTimingPage(props)}
            />
        </Container>
    );
};


function parseSelectedDate(str: string): Date {
    const date = tryParseDate(str);

    if (date === undefined) {
        console.error(`Unable to parse '${str}'. Showing default list view.`);
        return new Date();
    }

    return date;
}