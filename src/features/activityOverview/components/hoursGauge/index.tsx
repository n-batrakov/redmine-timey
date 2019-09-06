import './index.scss';
import * as React from 'react';
import { Line } from 'rc-progress';
import { Warning, Danger, Info } from 'components/alert';

export type HoursGaugeProps = {
    actualValue: number;
    expectedValue: number;
};

const defaultColor = '#000';
const colors: [number, number, string][] = [
    [0, 10, '#b81237'], // red
    [10, 50, '#ff9900'], // yellow
    [50, 100, '#2565b7'], // blue
    [100, 101, '#12b893'], // green
    [101, Infinity, 'midnightblue'],
];

const getColor = (percent: number) => {
    for (const [min, max, color] of colors) {
        if (percent >= min && percent < max) {
            return color;
        }
    }
    return defaultColor;
};

export const HoursGauge = React.memo(
    (props: HoursGaugeProps) => {
        const { actualValue, expectedValue } = props;
        const remaining = expectedValue - actualValue;
        const percent = (actualValue / expectedValue) * 100;

        const message = percent >= 100
            ? percent > 110 ? 'You work too much!' : 'All done! Great work!'
            : <>{<b>{actualValue}</b>} hours out of {<b>{expectedValue}</b>} are done. {<b>{remaining}</b>} more to go</>;

        return (
            <div className="hours-gauge">
                <Line percent={percent} strokeColor={getColor(percent)} strokeWidth={1} style={{ width: '100%', height: 8 }}/>
                <span style={{ margin: 'auto', fontSize: '10pt', marginTop: 5 }}>{message}</span>
            </div>
        );
    },
    (a, b) => a.actualValue === b.actualValue && a.expectedValue === b.expectedValue,
);