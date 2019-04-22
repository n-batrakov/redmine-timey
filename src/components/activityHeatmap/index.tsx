import * as React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { getRange, toISODate } from '../../shared/date';
import './activityHeatmap.css';

const colorThresholds = [
    [0, 1, '0'],
    [1, 4, '1'],
    [4, 8, '2'],
    [8, 8.01, '3'],
    [8.01, 12, '4'],
];

export type ActivityHeatmapProps = {
    startDate: Date,
    endDate: Date,
    data: Array<{ date: Date, count: number }>,
    onClick?: (value: {date: Date, count: number}) => void,
    numDays?: number,
    loading?: boolean,
};

const mapData = (start: Date, end: Date, data: Array<{ date: Date, count: number }>) => {

    const range = Array.from(getRange(start, end));

    const lookup = data.reduce<any>(
        (acc, x) => {
            const key = toISODate(x.date);
            acc[key] = x;
            return acc;
        },
        {},
    );

    return range.map((date) => {
        const key = toISODate(date);

        return lookup[key] || { date, count: 0 };
    });
};

export class ActivityHeatmap extends React.Component<ActivityHeatmapProps> {
    public render() {
        const values = mapData(this.props.startDate, this.props.endDate, this.props.data);
        return (
            <div className="activity-heatmap-container">
                <CalendarHeatmap
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    values={values}
                    classForValue={(value) => {
                        if (this.props.loading) {
                            return 'loading';
                        }

                        if (!value || value.count === 0) {
                            return 'color-empty';
                        }

                        for (const [min, max, color] of colorThresholds) {
                            if (value.count >= min && value.count < max) {
                                return `color-${color}`;
                            }
                        }

                        return 'color-warn';
                    }}
                    numDays={this.props.numDays}
                    showWeekdayLabels={true}
                    gutterSize={1.5}
                    weekdayLabels={['Sun', 'M', 'Tue', 'W', 'Thu', 'F', 'Sat']}
                    onClick={this.props.onClick}
                    tooltipDataAttrs={(value: any) => {
                        return {
                          'data-tip': value.count === null
                            ? ''
                            : `${value.date.toLocaleDateString()}<br/>${value.count} часов`,
                        };
                      }}
                />
            </div>
        );
    }
}