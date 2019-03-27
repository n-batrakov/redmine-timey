import * as React from 'react';
import { render } from 'react-dom';
import { ActivityHeatmap, ActivityHeatmapProps } from './components/activityHeatmap';
import { ActivityList, ActivityListProps } from './components/activityList';
import { HoursGauge, HoursGaugeProps } from './components/hoursGauge';
import { EditTimingModal, EditTimingModalProps} from './components/editTimingModal';
import { Logo } from './components/logo';
import { Navbar } from './components/navbar';
import { addDays, getMonthBoundaries } from './shared/date';
import ReactTooltip from 'react-tooltip';
import './index.css';
import { TimesheetEntry } from './shared/types';
import Modal from 'react-modal';

type AppState = {
    isLoaded: boolean,
    isError: boolean,
    modalData?: EditTimingModalProps,
    yearData?: ActivityHeatmapProps,
    listData?: ActivityListProps,
    gaugeData?: HoursGaugeProps,
};

const getMonthNorm = async () => {
    const response = await fetch('/api/time/norm');
    if (response.status === 200) {
        const data = await response.json();
        return data.norm;
    }
    return 0;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = { isLoaded: false, isError: false };
    }

    public componentDidMount() {
        this.onOverview();

        const heatmapEnd = new Date();
        const heatmapStart = addDays(heatmapEnd, -365);
        const [thisMonthStart, nextMonthStart] = getMonthBoundaries(heatmapEnd);

        fetch(`/api/time/hours?start=${heatmapStart.toISOString()}&end=${heatmapEnd.toISOString()}`).then(async (x) => {
            if (x.status === 200) {
                let data = await x.json();

                let actualValue = 0;
                data = data.map((x: any) => {
                    const date = new Date(Date.parse(x.date));
                    const count = x.count;

                    if (date >= thisMonthStart && date < nextMonthStart) {
                        actualValue += count;
                    }

                    return { date, count };
                });

                const expectedValue = await getMonthNorm();

                this.setState({
                    yearData: { data, startDate: heatmapStart, endDate: heatmapEnd },
                    gaugeData: { actualValue, expectedValue },
                    isLoaded: true,
                });
            }
        });
    }

    private setActivityListState(start: Date, end: Date) {
        fetch(`/api/time?start=${start.toISOString()}&end=${end.toISOString()}`).then(async (x) => {
            if (x.status === 200) {
                const response = await x.json();

                const data = response.data.map((item: any) => {
                    const { spentOn, ...rest } = item;
                    return {
                        ...rest,
                        spentOn: new Date(Date.parse(spentOn)),
                    };
                });

                this.setState({ isLoaded: true, listData: { start, end, data } });
            }
        });
    }

    private onLogout() {
        fetch('/api/logout', { method: 'POST' }).then((x) => {
            if (x.status === 401) {
                this.setState({ isLoaded: true, isError: false, listData: undefined, yearData: undefined });
            } else {
                alert('Something went wrong');
            }
        });
    }

    private onDayClick(value: { date: Date, count: number}) {
        this.setActivityListState(value.date, value.date);
    }

    private onActivityClick(entry: TimesheetEntry) {
        const modalData: EditTimingModalProps = {
            isOpened: true,
            data: entry,
            onClose: () => this.setState({ modalData: undefined }),
            onSubmit: (e) => {
                console.log('UPDATE', e);
                this.setState({ modalData: undefined });
            },
            onDelete: (e) => {
                console.log('DELETE', e);
                this.setState({ modalData: undefined });
            },
        };

        this.setState({ modalData });
    }

    private onOverview() {
        const listEnd = new Date();
        const listStart = addDays(listEnd, -5);
        this.setActivityListState(listStart, listEnd);
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
                <Navbar
                    logo={<Logo/>}
                    items={[
                        <button className="navbar-btn active" onClick={this.onOverview.bind(this)}>Overview</button>,
                    ]}
                    rightItems={[
                        <button className="navbar-btn" onClick={this.onLogout.bind(this)}>Logout</button>,
                    ]}
                />
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

Modal.setAppElement('#app');
render(<App />, document.getElementById('app'));