import * as React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';

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
};

export class ActivityHeatmap extends React.Component<ActivityHeatmapProps> {
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