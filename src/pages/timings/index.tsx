import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import ReactTooltip from 'react-tooltip';

import { addDays, getMonthBoundaries, toISODate } from '../../shared/date';

import { getDailyHours } from '../../api/getDailyHours';
import { getMonthNorm } from '../../api/getMonthNorm';

import { ActivityHeatmap, ActivityHeatmapProps } from '../../components/activityHeatmap';
import { HoursGauge, HoursGaugeProps } from '../../components/hoursGauge';
import { FromErrors } from '../../components/form';
import { ActivityListContainer } from './activityList';


type TimingsPageProps = RouteComponentProps<{
    date?: string,
}>;
type TimingsPageState = {
    heatmap?: ActivityHeatmapProps,
    gauge?: HoursGaugeProps,
};
export class TimingsPage extends React.Component<TimingsPageProps, TimingsPageState> {
    constructor(props: TimingsPageProps) {
        super(props);

        this.state = {};
    }

    public componentDidMount() {
        this.getPageState().then((state) => {
            this.setState(state);
        });
    }

    public render() {
        const today = new Date();
        const heatmapProps = this.state.heatmap || { data: [], startDate: addDays(today, -365), endDate: today };
        const gaugeProps = this.state.gauge || { actualValue: 0, expectedValue: 160 };

        return (
            <>
                <ReactTooltip html />
                <ActivityHeatmap { ...heatmapProps }
                                    onClick={this.onDayClick.bind(this)}
                                    numDays={window.innerWidth < 800 ? 100 : 0}/>

                <HoursGauge {...gaugeProps}/>

                <Switch>
                    <Route
                        exact
                        path={`${this.props.match.path}/:date(\\d{4}-\\d{2}-\\d{2})?`}
                        render={({ match }) => (
                            <ActivityListContainer />
                        )}
                    />
                    <Route render={() => (
                        <FromErrors errors={['Sorry, your URL is invalid. Please select a day on a calendar or choose a different page.']} />
                    )}/>
                </Switch>
            </>
        );
    }

    private async getPageState(): Promise<TimingsPageState> {
        const now = new Date();

        const heatmapEnd = now;
        const heatmapStart = addDays(heatmapEnd, -365);
        const calendar$ = getDailyHours({ start: heatmapStart, end: heatmapEnd });

        const [thisMonthStart, nextMonthStart] = getMonthBoundaries(now);
        const norm$ = getMonthNorm();

        const [calendar, { norm }] = await Promise.all([calendar$, norm$]);

        const actualNorm = calendar
            .filter(({ date }) => date >= thisMonthStart && date < nextMonthStart)
            .reduce((acc, x) => acc + x.count, 0);

        return {
            heatmap: {
                startDate: heatmapStart,
                endDate: heatmapEnd,
                data: calendar,
            },
            gauge: {
                actualValue: actualNorm,
                expectedValue: norm,
            },
        };
    }

    private onDayClick(value: { date: Date, count: number}) {
        this.props.history.push(`${this.props.match.path}/${toISODate(value.date)}`);
    }
}