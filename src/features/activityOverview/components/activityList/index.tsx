import './index.scss';
import * as React from 'react';

import { IssueHeader } from 'components/issueHeader';

import { dateRange, toISODate } from 'shared/date';
import { TimesheetEntry } from 'shared/types';
import { NavLink } from 'react-router-dom';
import { IconEdit } from 'components/icon';
import { ListItem, List, ListSkeleton } from 'components/list';


type ActivityDayProps = {
    date: Date,
    hours?: number,
    entries?: TimesheetEntry[],
    onActivityAdd?: (date: Date) => void,
    onActivityClick?: (x: TimesheetEntry) => void,
};

const ActivityDay = (props : ActivityDayProps) => {
    const list = props.entries || [];

    return (
        <div className="day">
            <div className="day-header">
                <h5>{formatDate(props.date)} - {props.hours || 0} hours</h5>
                <NavLink className="btn-add" to={`/time/new?date=${toISODate(props.date)}`}>Add Activity</NavLink>
            </div>
            <List>
            {
                list.length === 0
                ? <ListItem className="activity placeholder" inline><h4>No activity</h4></ListItem>
                : list.map(entry => (
                    <ListItem key={entry.id} className="activity" style={{ minHeight: 78 }} inline>
                        <div className="prepend">
                            {entry.hours} h.
                        </div>
                        <div className="issue-container">
                            <h5 className="header"><IssueHeader project={entry.project} issue={entry.issue} showNumber column/></h5>
                            <div className="content">{entry.comments}</div>
                        </div>
                        <NavLink className="action btn-edit" to={`/time/${entry.id}`} title="Edit entry">
                            <IconEdit />
                        </NavLink>
                    </ListItem>
                ))
            }
            </List>
        </div>
    );
};


export type ActivityListProps = {
    start: Date,
    end: Date,
    loading?: boolean,
    data?: Array<TimesheetEntry>,
    onActivityClick?: (x: TimesheetEntry) => void,
    onActivityAddClick?: (date: Date) => void,
};
export const ActivityList = (props: ActivityListProps) => {
    if (props.loading) {
        return <ListSkeleton size={10} itemClassName="activity" />;
    }

    const data = mapData(props.data || []);

    const items = Array.from(dateRange(props.end, props.start, -1)).map((date) => {
        const key = toISODate(date);
        const entries = data.get(key);

        if (entries === undefined) {
            return <ActivityDay key={key} date={date} onActivityAdd={props.onActivityAddClick} />;
        }

        return <ActivityDay
            key={key}
            date={date}
            entries={entries}
            hours={countTotalHours(entries)}
            onActivityAdd={props.onActivityAddClick}
            onActivityClick={props.onActivityClick}
        />;
    });

    return (
        <div className="activity-list">
            {items}
        </div>
    );
};




const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wedsday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(date: Date): string {
    const dayNumber = date.getDate();
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];

    return `${dayName}, ${dayNumber} ${monthName}`;
}

function countTotalHours(entries: TimesheetEntry[]) {
    return entries.reduce((sum, x) => sum + x.hours, 0);
}

function mapData(data: TimesheetEntry[]) {
    return data.reduce(
        (acc, x) => {
            const key = toISODate(x.spentOn);

            if (acc.has(key)) {
                acc.get(key)!.push(x);
            } else {
                acc.set(key, [x]);
            }

            return acc;
        },
        new Map<string, TimesheetEntry[]>(),
    );
}