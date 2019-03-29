import * as React from 'react';
import ReactTooltip from 'react-tooltip';

import { addDays, getMonthBoundaries } from '../shared/date';
import { TimesheetEntry } from '../shared/types';
import * as API from '../client';

import { ActivityHeatmap, ActivityHeatmapProps } from '../components/activityHeatmap';
import { ActivityList, ActivityListProps } from '../components/activityList';
import { HoursGauge, HoursGaugeProps } from '../components/hoursGauge';
import { EditTimingModal, EditTimingModalProps } from '../components/editTimingModal';

const listPageSize = 5;

type TimingsPageState = {
    isLoaded: boolean,
    isError: boolean,
    modalData?: EditTimingModalProps,
    yearData?: ActivityHeatmapProps,
    listData?: ActivityListProps,
    gaugeData?: HoursGaugeProps,
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
        .filter(({date}) => date >= thisMonthStart && date < nextMonthStart)
        .reduce((acc, x) => acc + x.count, 0);

    return {
        isLoaded: true,
        isError: false,
        listData: {
            start: listStart,
            end: listEnd,
            data: list,
        },
        yearData: {
            startDate: heatmapStart,
            endDate: heatmapEnd,
            data: calendar,
        },
        gaugeData: {
            actualValue: actualNorm,
            expectedValue: norm,
        },
    };
}

export class TimingsPage extends React.Component<{}, TimingsPageState> {
    constructor(props: {}) {
        super(props);
        this.state = { isLoaded: false, isError: false };
    }

    public componentDidMount() {
        getPageState().then(x => this.setState(x));
    }

    private onDayClick(value: { date: Date, count: number}) {
        API.queryTimeEntries(value.date, value.date).then((data) => {
            this.setState({ isLoaded: true, listData: { data, start: value.date, end: value.date } });
        });
    }

    private onActivityClick(entry: TimesheetEntry) {
        const modalData: EditTimingModalProps = {
            isOpened: true,
            data: entry,
            onClose: () => this.setState({ modalData: undefined }),
            onSubmit: async (e) => {
                await API.updateTimeEntry(e);

                const state = await getPageState();
                this.setState({
                    ...state,
                    modalData: undefined,
                });
            },
            onDelete: async (id) => {
                await API.deleteTimeEntry(id);

                const state = await getPageState();
                this.setState({
                    ...state,
                    modalData: undefined,
                });
            },
        };

        this.setState({ modalData });
    }

    public render() {
        if (this.state.isError) {
            return <p>Something went wrong</p>;
        }

        if (!this.state.isLoaded) {
            return <p>Stand by...</p>;
        }

        const today = new Date();
        const heatmapProps = this.state.yearData || { data: [], startDate: addDays(today, -365), endDate: today };
        const gaugeProps = this.state.gaugeData || { actualValue: 0, expectedValue: 160 };
        const listProps = this.state.listData || { data: [], start: new Date(), end: new Date() };

        return (
            <>
                <ReactTooltip html />
                { this.state.modalData === undefined ? undefined : <EditTimingModal { ...this.state.modalData }/> }
                <div className="content">
                    <ActivityHeatmap { ...heatmapProps }
                                     onClick={this.onDayClick.bind(this)}
                                     numDays={window.innerWidth < 800 ? 100 : 0}/>

                    <HoursGauge {...gaugeProps}/>

                    <div className="activity-overview">
                        <h1>Activity Overview</h1>
                        <ActivityList { ...listProps } onActivityClick={this.onActivityClick.bind(this)}/>
                    </div>
                </div>
            </>
        );
    }
}