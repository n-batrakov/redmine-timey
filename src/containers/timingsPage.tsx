import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, RouteComponentProps } from 'react-router';
import ReactTooltip from 'react-tooltip';

import { addDays, toISODate } from '../shared/date';

import { AppState } from '../store';

import { ActivityListContainer } from './activityList';
import { ActivityHeatmap, ActivityHeatmapProps } from '../components/activityHeatmap';
import { HoursGauge, HoursGaugeProps } from '../components/hoursGauge';
import { FromErrors } from '../components/form';

import { loadData } from '../store/timingsPage/actions';
import { loadEnumerations } from '../store/enumerations/actions';
import { PageContent } from '../components/pageContent';
import { MobileScreen, MobileScreenHidden } from '../components/mediaQuery';


export type TimingsPageContainerProps = {
    heatmap?: { data: Array<{ date: Date, count: number }> },
    onDayChange?: (x: { date: Date, count: number }) => void,

    gauge?: HoursGaugeProps,

    isLoading: boolean,
    loadData: () => void,
    loadEnumerations: () => void,
} & RouteComponentProps;
const Page = (props: TimingsPageContainerProps) => {
    React.useEffect(
        () => {
            props.loadEnumerations();
            props.loadData();
        },
        [],
    );

    const today = new Date();
    const heatmapProps = {
        data: props.heatmap === undefined ? [] : props.heatmap.data,
        loading: props.isLoading,
        endDate: today,
        onClick: (x: { date: Date}) => props.history.push(`${props.match.path}/${toISODate(x.date)}`),
    };
    const gaugeProps = props.gauge || { actualValue: 0, expectedValue: 160 };

    return (
        <PageContent>
            <ReactTooltip html />

            <MobileScreen>
                <ActivityHeatmap {...heatmapProps} startDate={addDays(today, -120)} />
            </MobileScreen>
            <MobileScreenHidden>
                <ActivityHeatmap {...heatmapProps} startDate={addDays(today, -365)} />
            </MobileScreenHidden>

            <HoursGauge {...gaugeProps}/>

            <Switch>
                <Route
                    exact
                    path={`${props.match.path}/:date(\\d{4}-\\d{2}-\\d{2})?`}
                    render={route => <ActivityListContainer {...route}/>}
                />
                <Route render={() => (
                    <FromErrors errors={['Sorry, your URL is invalid. Please select a day on a calendar or choose a different page.']} />
                )}/>
            </Switch>
        </PageContent>
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
        loadEnumerations,
    },
)(Page);