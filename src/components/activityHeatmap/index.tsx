import * as React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import { getRange, toISODate } from '../../date';

const colorThresholds = [
    [0, 4, '1'],
    [4, 7, '2'],
    [7, 10, '3'],
    [10, 12, '4'],
];

export type ActivityHeatmapProps = {
    startDate: Date,
    endDate: Date,
    data: Array<{ date: Date, count: number }>,
    onClick?: (value: {date: Date, count: number}) => void,
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
            <div>
                <CalendarHeatmap
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    values={values}
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