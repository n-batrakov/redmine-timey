import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import ReactTooltip from 'react-tooltip';

import { addDays } from '../../shared/date';

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
};
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
                onClick={props.onDayChange}
                numDays={window.innerWidth < 800 ? 100 : 0}
            />

            <HoursGauge {...gaugeProps}/>

            <Switch>
                <Route
                    exact
                    //path={`time/:date(\\d{4}-\\d{2}-\\d{2})?`}

                    render={({ match }) => (
                        <ActivityListContainer/>
                    )}
                />
                <Route render={() => (
                    <FromErrors errors={['Sorry, your URL is invalid. Please select a day on a calendar or choose a different page.']} />
                )}/>
            </Switch>
        </>
    );
};

export const TimingsPageContainer = connect(
    (state: AppState): Partial<TimingsPageContainerProps> => ({
        gauge: state.timingsPage.gauge,
        heatmap: state.timingsPage.heatmap,
    }),
    {
        loadData,
    },
)(Page);