import * as React from 'react';
import { render } from 'react-dom';
import { ActivityHeatmap, ActivityHeatmapProps } from './components/activityHeatmap';
import { ActivityList, ActivityListProps } from './components/activityList';
import { addDays } from './date';
import './index.css';

type AppState = {
    isLoaded: boolean,
    isError: boolean,
    yearData?: ActivityHeatmapProps,
    listData?: ActivityListProps,
};

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = { isLoaded: false, isError: false };
    }

    public componentDidMount() {
        this.onOverview();

        const heatmapEnd = new Date();
        const heatmapStart = addDays(heatmapEnd, -365);
        fetch(`/api/time/month?start=${heatmapStart.toISOString()}&end=${heatmapEnd.toISOString()}`).then(async (x) => {
            if (x.status === 200) {
                let data = await x.json();

                data = data.map((x: any) => ({ date: new Date(Date.parse(x.date)), count: x.count }));

                this.setState({
                    yearData: { data, startDate: heatmapStart, endDate: heatmapEnd },
                    isLoaded: true,
                });
            }
        });
    }

    private setActivityListState(start: Date, end: Date) {
        fetch(`/api/time?start=${start.toISOString()}&end=${end.toISOString()}`).then(async (x) => {
            if (x.status === 200) {
                const data = await x.json();

                const items = data.data.map((item: any) => {
                    const { spentOn, ...rest } = item;
                    return {
                        ...rest,
                        spentOn: new Date(Date.parse(spentOn)),
                    };
                });

                this.setState({ isLoaded: true, listData: { data: items } });
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

    private onOverview() {
        const listEnd = new Date();
        const listStart = addDays(listEnd, -5);
        this.setActivityListState(listStart, listEnd);
    }

    public render() {
        if (!this.state.isLoaded) {
            return <p>Stand by...</p>;
        }

        if (this.state.isError) {
            return <p>Something went wrong</p>;
        }

        const today = new Date();
        const heatmapProps = this.state.yearData || { data: [], startDate: addDays(today, -365), endDate: today };
        const listProps = this.state.listData || { data: [] };

        return (
            <>
                <button onClick={this.onLogout.bind(this)}>Logout</button>
                <button onClick={this.onOverview.bind(this)}>Overview</button>
                <ActivityHeatmap onClick={this.onDayClick.bind(this)} { ...heatmapProps } />

                <h1>Activity Overview</h1>
                <ActivityList { ...listProps } />
            </>
        );
    }
}

render(<App />, document.getElementById('app'));