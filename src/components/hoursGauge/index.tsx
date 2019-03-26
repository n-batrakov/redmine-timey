import * as React from 'react';
import { Line } from 'rc-progress';

export type HoursGaugeProps = {
    actualValue: number;
    expectedValue: number;
};

const defaultColor = '#000';
const colors: [number, number, string][] = [
    [0, 10, '#dc3545'],
    [10, 50, '#ffc107'],
    [50, 100, '#17a2b8'],
    [100, 101, '#28a745'],
    [101, 200, '#343a40'],
];

const getColor = (percent: number) => {
    for (const [min, max, color] of colors) {
        if (percent >= min && percent < max) {
            return color;
        }
    }
    return defaultColor;
}

export class HoursGauge extends React.Component<HoursGaugeProps> {
    public render() {
        const { actualValue, expectedValue } = this.props;
        const remaining = expectedValue - actualValue;
        const percent = (actualValue / expectedValue) * 100;

        const message = percent >= 100
            ? percent > 110 ? 'You work too much!' : 'All done! Great work!'
            : <>{<b>{actualValue}</b>} hours out of {<b>{expectedValue}</b>} are done. {<b>{remaining}</b>} more to go</>;

        return (
            <div style={{ width: 918, margin: 'auto' }}>
                <Line percent={percent} strokeColor={getColor(percent)}/>
                <span>{message}</span>
            </div>
        );
    }
}