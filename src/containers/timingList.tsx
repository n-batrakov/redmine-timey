import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { addDays, toISODate, tryParseDate } from '../shared/date';

import { AppState } from '../store';

import { ActivityListContainer } from './activityList';
import { ActivityHeatmap } from '../components/activityHeatmap';
import { HoursGauge, HoursGaugeProps } from '../components/hoursGauge';

import { loadData } from '../store/timingsPage/actions';
import { Container } from '../components/container';
import { MobileScreen, MobileScreenHidden } from '../components/mediaQuery';
import { TimesheetEntry } from '../shared/types';


const parseSelectedDate = (str: string): Date => {
    const date = tryParseDate(str);

    if (date === undefined) {
        console.error(`Unable to parse '${str}'. Showing default list view.`);
        return new Date();
    }

    return date;
};

const gotoNewTimingPage = (props: RouteComponentProps) => React.useCallback(
    (date: Date) => props.history.push(`/time/new?date=${toISODate(date)}`),
    [],
);

const gotoEditTimingPage = (props: RouteComponentProps) => React.useCallback(
    (entry: TimesheetEntry) => props.history.push(`/time/${entry.id}`),
    [],
);

export type TimingsPageContainerProps = {
    heatmap?: { data: Array<{ date: Date, count: number }> },
    onDayChange?: (x: { date: Date, count: number }) => void,

    gauge?: HoursGaugeProps,

    isLoading: boolean,
    loadData: () => void,
} & RouteComponentProps;
const Page = (props: TimingsPageContainerProps) => {
    React.useEffect(() => { props.loadData(); }, []);

    const today = new Date();
    const heatmapProps = {
        data: props.heatmap === undefined ? [] : props.heatmap.data,
        loading: props.isLoading,
        endDate: today,
        onClick: (x: { date: Date}) => props.history.push(`${props.match.path}?date=${toISODate(x.date)}`),
    };
    const gaugeProps = props.gauge || { actualValue: 0, expectedValue: 160 };

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

export const TimingsPageContainer = connect(
    (state: AppState, props: Partial<TimingsPageContainerProps>): Partial<TimingsPageContainerProps> => ({
        ...props,
        gauge: state.timingsPage.gauge,
        heatmap: state.timingsPage.heatmap,
        isLoading: state.timingsPage.isLoading,
    }),
    {
        loadData,
    },
)(Page);