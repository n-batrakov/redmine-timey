import * as React from 'react';
import { render } from 'react-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';

type AppState = {
    isLoaded: boolean,
    isError: boolean,
    data: any,
    yearData?: ActivityHeatmapProps,
};

function shiftDate(date:Date, numDays:number) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
}



const colorThresholds = [
    [0, 4, '1'],
    [4, 7, '2'],
    [7, 10, '3'],
    [10, 12, '4'],
];

type ActivityHeatmapProps = {
    startDate: Date,
    endDate: Date,
    data: Array<{ date: Date, count: number }>,
};
class ActivityHeatmap extends React.Component<ActivityHeatmapProps> {
    public render() {
        return (
            <div>
                <CalendarHeatmap
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    values={this.props.data}
                    classForValue={(value) => {
                        if (!value) {
                            return 'color-empty';
                        }

                        for (const [min, max, color] of colorThresholds) {
                            if (value.count >= min && value.count < max) {
                                return `color-${color}`;
                            }
                        }

                        return 'color-warn';
                    }}
                    showWeekdayLabels={true}
                    onClick={value => console.log(value)}
                    tooltipDataAttrs={(value: any) => {
                        return {
                          'data-tip': value.count === null
                            ? ''
                            : `${value.date.toLocaleDateString()}<br/>${value.count} часов`,
                        };
                      }}
                />
                <ReactTooltip html />
            </div>
        );
    }
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = { isLoaded: false, isError: false, data: undefined };

        this.onBtnClick = this.onBtnClick.bind(this);
    }

    componentDidMount() {
        fetch('/api/time').then(async (x) => {
            if (x.status !== 200) {
                this.setState({ isError: true, isLoaded: true });
                return;
            }

            const data = await x.json();
            this.setState({ data, isLoaded: true });
        });

        const endDate = new Date();
        const startDate = shiftDate(endDate, -365);
        fetch(`/api/time/month?start=${startDate.toISOString()}&end=${endDate.toISOString()}`).then(async (x) => {
            if (x.status !== 200) {
                this.setState({ isError: true, isLoaded: true });
                return;
            }

            let data = await x.json();

            data = data.map((x: any) => ({ date: new Date(Date.parse(x.date)), count: x.count }));

            this.setState({
                yearData: { data, startDate, endDate },
                isLoaded: true,
            });
        });
    }

    private onBtnClick() {
        fetch('/api/logout', { method: 'POST' }).then((x) => {
            if (x.status === 401) {
                this.setState({ isLoaded: true, isError: false, data: 'Logged out' });
            } else {
                alert('Something went wrong');
            }
        });
    }

    public render() {
        if (!this.state.isLoaded) {
            return <p>Stand by...</p>;
        }

        if (this.state.isError) {
            return <p>Something went wrong</p>;
        }

        const today = new Date();
        const heatmapProps = this.state.yearData || { data: [], startDate: shiftDate(today, -365), endDate: today };

        return (
            <>
                <button onClick={this.onBtnClick}>Logout</button>
                <ActivityHeatmap {...heatmapProps} />
                <code>{JSON.stringify(this.state.data, null, 4)}</code>
            </>
        );
    }
}

render(<App />, document.getElementById('app'));