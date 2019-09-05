import './index.scss';
import * as React from 'react';
import { dateRange, addDays, toISODate, equalDate, weekday, isWeekend } from 'shared/date';
import classNames from 'classnames';
import { bind, assertNever } from 'shared/utils';
import { IconArrowLeft, IconArrowRight } from 'components/icon/arrow';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const labels = getWeekdayLabels();

export type CalendarProps = {
    year: number,
    month: number,
    onChange?: (year: number, month: number) => void,

    selected?: Date,
    onSelect?: (date: Date) => void,

    className?: string,
    dayClassName?: (date: Date) => string | undefined,

    style?: React.CSSProperties,
};

export const Calendar = (props: CalendarProps) => {
    const now = new Date();
    const data = getMonthData(props.year, props.month);

    return (
        <div className={classNames('timey-calendar', props.className)} style={props.style}>
            <h3 className="calendar-month-picker">
                <button onClick={onDateChange(props, 'dec')}><IconArrowLeft /></button>
                {formatHeader(props.year, props.month)}
                <button onClick={onDateChange(props, 'inc')}><IconArrowRight /></button>
            </h3>
            {
                labels.map(x => (
                    <label key={x} className="calendar-label">{x}</label>
                ))
            }
            {
                data.map(date => (
                    <span
                        key={toISODate(date)}
                        className={getDayClass(props, date, now)}
                        onClick={bind(props.onSelect, date)}
                    >
                        {date.getDate()}
                    </span>
                ))
            }
        </div>
    );
};

function formatHeader(year: number, month: number) {
    return `${(month + 1).toString(10).padStart(2, '0')} / ${year}`;
}

function onDateChange(props: CalendarProps, type: 'inc' | 'dec') {
    return React.useCallback(
        () => {
            if (props.onChange === undefined) {
                return;
            }

            const january = 0;
            const december = 11;

            switch (type) {
                case 'inc':
                    const incYear = props.month === december ? props.year + 1 : props.year;
                    const incMonth = props.month === december ? 0 : props.month + 1;
                    props.onChange(incYear, incMonth);
                    break;
                case 'dec':
                    const decYear = props.month === january ? props.year - 1 : props.year;
                    const decMonth = props.month === january ? december : props.month - 1;
                    props.onChange(decYear, decMonth);
                    break;
                default:
                    assertNever(type);
                    console.error(`Unexpected case ${type} in date change.`);
                    break;
            }
        },
        [props.onChange, type],
    );
}

function getDayClass(props: CalendarProps, date: Date, now: Date) {
    const userClassName = props.dayClassName === undefined ? undefined : props.dayClassName(date);

    return classNames(
            'calendar-day',
            {
                today: equalDate(now, date),
                selected: props.selected !== undefined && equalDate(props.selected, date),
                disabled: props.year !== date.getFullYear() || props.month  !== date.getMonth(),
                weekend: isWeekend(date),
            },
            userClassName,
        );
}

function getMonthData(year: number, month: number)  {
    const cols = 7;
    const rows = 6;

    const monthStart = new Date(year, month, 1, 9, 41);
    const offset = weekday(monthStart.getDay());

    const start = addDays(monthStart, -offset);
    const end = addDays(start, cols * rows - 1);

    return Array.from(dateRange(start, end));
}

function getWeekdayLabels() {
    return weekdays.reduce(
        (arr, label, dayIdx) => {
            arr[weekday(dayIdx)] = label;
            return arr;
        },
        new Array<string>(7),
    );
}