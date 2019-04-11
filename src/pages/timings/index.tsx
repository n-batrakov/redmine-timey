import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, RouteComponentProps } from 'react-router';
import ReactTooltip from 'react-tooltip';

import { addDays, toISODate } from '../../shared/date';

import { AppState } from '../../state';

import { ActivityListContainer } from '../activityList';
import { ActivityHeatmap, ActivityHeatmapProps } from '../../components/activityHeatmap';
import { HoursGauge, HoursGaugeProps } from '../../components/hoursGauge';
import { FromErrors } from '../../components/form';

import { loadData } from './actions';



export type TimingsPageContainerProps = {
    heatmap?: ActivityHeatmapProps,
    onDayChange?: (x: { date: Date, count: number }) => void,

    gauge?: HoursGaugeProps,

    loadData: () => void,
} & RouteComponentProps;
const Page = (props: TimingsPageContainerProps) => {
    React.useEffect(() => props.loadData(), []);

    const today = new Date();
    const heatmapProps = props.heatmap || { data: [], startDate: addDays(today, -365), endDate: today };
    const gaugeProps = props.gauge || { actualValue: 0, expectedValue: 160 };

    return (
        <>
            <ReactTooltip html />
            <ActivityHeatmap
                { ...heatmapProps }
                onClick={({ date }) => props.history.push(`${props.match.path}/${toISODate(date)}`)}
                numDays={window.innerWidth < 800 ? 100 : 0}
            />

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
        </>
    );
};

export const TimingsPageContainer = connect(
    (state: AppState, props: Partial<TimingsPageContainerProps>): Partial<TimingsPageContainerProps> => ({
        ...props,
        gauge: state.timingsPage.gauge,
        heatmap: state.timingsPage.heatmap,
    }),
    {
        loadData,
    },
)(Page);