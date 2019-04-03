import * as React from 'react';
import ReactTooltip from 'react-tooltip';

import { addDays, getMonthBoundaries } from '../shared/date';
import { TimesheetEntry } from '../shared/types';
import * as API from '../client';

import { ActivityHeatmap, ActivityHeatmapProps } from '../components/activityHeatmap';
import { ActivityList, ActivityListProps } from '../components/activityList';
import { HoursGauge, HoursGaugeProps } from '../components/hoursGauge';
import { EditTimingModal, EditTimingModalProps, CreateTimingModal, CreateTimingModalProps } from '../components/editTimingModal';
import { Preloader } from '../components/preloader';

const listPageSize = 5;

type TimingsPageState = {
    isError: boolean,
    editModal?: EditTimingModalProps,
    createModal?: CreateTimingModalProps,
    heatmap?: ActivityHeatmapProps,
    activityList?: ActivityListProps,
    gauge?: HoursGaugeProps,
};

async function getPageState(): Promise<TimingsPageState> {
    const now = new Date();

    const heatmapEnd = now;
    const heatmapStart = addDays(heatmapEnd, -365);
    const calendar$ = API.fetchHours(heatmapStart, heatmapEnd);

    const [thisMonthStart, nextMonthStart] = getMonthBoundaries(now);
    const norm$ = API.getMonthNorm();

    const listEnd = now;
    const listStart = addDays(listEnd, -listPageSize);
    const list$ = API.queryTimeEntries(listStart, listEnd);

    const [calendar, norm, list] = await Promise.all([calendar$, norm$, list$]);

    const actualNorm = calendar
        .filter(({ date }) => date >= thisMonthStart && date < nextMonthStart)
        .reduce((acc, x) => acc + x.count, 0);

    return {
        isError: false,
        activityList: {
            start: listStart,
            end: listEnd,
            data: list,
        },
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

export class TimingsPage extends React.Component<{}, TimingsPageState> {
    constructor(props: {}) {
        super(props);
        this.state = { isError: false };
    }

    public componentDidMount() {
        getPageState().then(x => this.setState(x));
    }

    private onDayClick(value: { date: Date, count: number}) {
        this.setState({ activityList: undefined });
        API.queryTimeEntries(value.date, value.date).then((data) => {
            this.setState({ activityList: { data, start: value.date, end: value.date } });
        });
    }

    private async onActivityClick(entry: TimesheetEntry) {
        const modalData: EditTimingModalProps = {
            opened: true,
            data: entry,
            onClose: () => this.setState({ editModal: undefined }),
            enumerations: await API.getEnumerations(),
            onUpdate: async (e, finish) => {
                await API.updateTimeEntry(e);

                const state = await getPageState();

                finish();

                this.setState({
                    ...state,
                    editModal: undefined,
                });
            },
            onDelete: async (id, finish) => {
                await API.deleteTimeEntry(id);

                const state = await getPageState();

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

                const state = await getPageState();

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

    public render() {
        if (this.state.isError) {
            return <p>Something went wrong</p>;
        }

        const today = new Date();
        const heatmapProps = this.state.heatmap || { data: [], startDate: addDays(today, -365), endDate: today };
        const gaugeProps = this.state.gauge || { actualValue: 0, expectedValue: 160 };

        return (
            <>
                <ReactTooltip html />
                { this.state.editModal === undefined ? undefined : <EditTimingModal { ...this.state.editModal }/> }
                { this.state.createModal === undefined ? undefined : <CreateTimingModal { ...this.state.createModal }/> }
                <div className="content">
                    <ActivityHeatmap { ...heatmapProps }
                                     onClick={this.onDayClick.bind(this)}
                                     numDays={window.innerWidth < 800 ? 100 : 0}/>

                    <HoursGauge {...gaugeProps}/>

                    <div className="activity-overview">
                        <h1>Activity Overview</h1>
                        {
                            this.state.activityList === undefined
                                ? <Preloader active />
                                : <ActivityList
                                    { ...this.state.activityList }
                                    onActivityClick={this.onActivityClick.bind(this)}
                                    onActivityAddClick={this.onActivityAddClick.bind(this)}
                                />
                        }
                    </div>
                </div>
            </>
        );
    }
}