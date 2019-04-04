import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import ReactTooltip from 'react-tooltip';

import { addDays, getMonthBoundaries, toISODate } from '../shared/date';
import { TimesheetEntry } from '../shared/types';
import * as API from '../client';

import { ActivityHeatmap, ActivityHeatmapProps } from '../components/activityHeatmap';
import { ActivityList } from '../components/activityList';
import { HoursGauge, HoursGaugeProps } from '../components/hoursGauge';
import { EditTimingModal, EditTimingModalProps, CreateTimingModal, CreateTimingModalProps } from '../components/editTimingModal';
import { Preloader } from '../components/preloader';
import { FromErrors, Form } from '../components/form';

const parseDate = (str?: string) => {
    if (str === undefined || str === null || str === '') {
        return undefined;
    }

    const dateNum = Date.parse(str);
    if (isNaN(dateNum)) {
        return undefined;
    }

    const date = new Date(dateNum);

    if (date.getFullYear() === NaN) {
        return undefined;
    }

    return date;
};

type StatefulActivityListProps = {
    date?: string,
    onActivityClick?: (x: TimesheetEntry) => void,
    onActivityAddClick?: (x: Date) => void,
};
const StatefulActivityList = (props: StatefulActivityListProps) => {
    const now = new Date();
    const date = parseDate(props.date);
    const start = date || addDays(now, -7);
    const end = date || now;

    const [state, setState] = React.useState({
        data: [] as TimesheetEntry[],
        isLoading: true,
    });

    React.useEffect(
        () => {
            setState({ ...state, isLoading: true });
            API.queryTimeEntries(start, end).then((data) => {
                setState({ data, isLoading: false });
            });
        },
        [props.date]);

    return (
        <div className="activity-overview">
            <h1>{date === undefined ? 'Activity Overview' : date.toLocaleDateString()}</h1>
            <Preloader active={state.isLoading} />
            <div style={{ display: state.isLoading ? 'none' : undefined }}>
                <ActivityList
                    data={state.data}
                    start={start}
                    end={end}
                    onActivityClick={props.onActivityClick}
                    onActivityAddClick={props.onActivityAddClick}
                />
            </div>
        </div>
    );
};



type TimingsPageProps = RouteComponentProps<{
    date?: string,
}>;
type TimingsPageState = {
    editModal?: EditTimingModalProps,
    createModal?: CreateTimingModalProps,
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
                { this.state.editModal === undefined ? undefined : <EditTimingModal { ...this.state.editModal }/> }
                { this.state.createModal === undefined ? undefined : <CreateTimingModal { ...this.state.createModal }/> }

                <ActivityHeatmap { ...heatmapProps }
                                    onClick={this.onDayClick.bind(this)}
                                    numDays={window.innerWidth < 800 ? 100 : 0}/>

                <HoursGauge {...gaugeProps}/>

                <Switch>
                    <Route
                        exact
                        path={`${this.props.match.path}/:date(\\d{4}-\\d{2}-\\d{2})?`}
                        render={({ match }) => (
                            <StatefulActivityList
                                {...this.props}
                                date={match.params.date }
                                onActivityAddClick={this.onActivityAddClick.bind(this)}
                                onActivityClick={this.onActivityClick.bind(this)}
                            />
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
        const calendar$ = API.fetchHours(heatmapStart, heatmapEnd);

        const [thisMonthStart, nextMonthStart] = getMonthBoundaries(now);
        const norm$ = API.getMonthNorm();

        const [calendar, norm] = await Promise.all([calendar$, norm$]);

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

    private async onActivityClick(entry: TimesheetEntry) {
        const modalData: EditTimingModalProps = {
            opened: true,
            data: entry,
            onClose: () => this.setState({ editModal: undefined }),
            enumerations: await API.getEnumerations(),
            onUpdate: async (e, finish) => {
                await API.updateTimeEntry(e);

                const state = await this.getPageState();

                finish();

                this.setState({
                    ...state,
                    editModal: undefined,
                });
            },
            onDelete: async (id, finish) => {
                await API.deleteTimeEntry(id);

                const state = await this.getPageState();

                finish();

                this.setState({
                    ...state,
                    editModal: undefined,
                });
            },
        };

        this.setState({ editModal: modalData });
    }

    private async onActivityAddClick(date: Date) {
        const createModal: CreateTimingModalProps = {
            opened: true,
            enumerations: await API.getEnumerations(),
            issueSource: API.getIssues,
            defaultValue: {
                spentOn: date,
            },
            onCreate: async (entry, finish, setErrors) => {
                const [response] = await API.addTimeEntries([entry]);
                if (response.code === 'Error') {
                    setErrors(response.errors);
                    return;
                }

                const state = await this.getPageState();

                finish();

                this.setState({
                    ...state,
                    createModal: undefined,
                });
            },
            onClose: () => {
                this.setState({ createModal: undefined });
            },
        };

        this.setState({ createModal });
    }
}