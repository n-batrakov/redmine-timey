import './index.scss';
import * as React from 'react';

import { IssueHeader } from 'components/issueHeader';

import { getRange, toISODate } from 'shared/date';
import { TimesheetEntry, isTimesheetEntryEqual } from 'shared/types';
import { List, ListItem } from 'components/list';
import { bind } from 'shared';

import { IconAdd } from 'components/icon';
import { Button } from 'components/button';


const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wedsday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatDate = (date: Date): string => {
    const dayNumber = date.getDate();
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];

    return `${dayName} (${dayNumber} ${monthName})`;
};

const countTotalHours = (issues: Array<[string, TimesheetEntry[]]>) => {
    const countIssueHours = (x: TimesheetEntry[]) => x.reduce((a, b) => a + b.hours, 0);

    return issues.reduce((acc, [_, x]) => acc + countIssueHours(x), 0);
};

const mapData = (data: TimesheetEntry[]) => {
    return data.reduce(
        (acc, x) => {
            const key = toISODate(x.spentOn);
            let issuesMap = acc.get(key);

            if (issuesMap === undefined) {
                issuesMap = new Map();
                acc.set(key, issuesMap);
            }

            const issueKey = `${x.project === undefined ? '' : x.project.name} / ${x.issue === undefined ? '' : x.issue.name}`;
            const issueGroup = issuesMap.get(issueKey);

            if (issueGroup === undefined) {
                issuesMap.set(issueKey, [x]);
            } else {
                issueGroup.push(x);
            }

            return acc;
        },
        new Map<string, Map<string, TimesheetEntry[]>>(),
    );
};



const AddAcivityButton = (props: { onClick?: () => void }) => (
        <Button
            tooltip="Add timing"
            size="small"
            label={<IconAdd/>}
            style={{ marginLeft: 'auto' }}
            onClick={props.onClick}
        />
);

type ActivityListItemProps = {date: Date, hours: number, children?: React.ReactNode, style?: React.CSSProperties };
const ActivityListItem = ({ date, hours, children, style }: ActivityListItemProps) => (
    <div className="list-day" style={style}>
        <h2><span>{formatDate(date)} - {hours} hours</span></h2>
        {children}
    </div>
);

const ActivityTiming = (x: { entry: TimesheetEntry, onClick?: (x: TimesheetEntry) => void }) => {
    return (
        <ListItem
            style={{ display: 'flex' }}
            onClick={() => x.onClick === undefined ? undefined : x.onClick(x.entry)}
            clickable
        >
            {x.entry.comments}
            <span className="list-issue-hours">{x.entry.hours} h.</span>
        </ListItem>
    );
};

const ActivityIssue = ({ items, onActivityClick } : {items: TimesheetEntry[], onActivityClick?: (x: TimesheetEntry) => void}) => {
    const project = items[0].project;
    const issue = items[0].issue;

    return (
        <div className="list-issue">
            <IssueHeader project={project} issue={issue} />
            <List>
                {
                    items.map(x => <ActivityTiming key={x.id} entry={x} onClick={onActivityClick}/>)
                }
            </List>
        </div>
    );
};

const EmptyActivityDay = ({ date, onActivityAdd } : {date: Date, onActivityAdd?: (date: Date) => void}) => (
    <ActivityListItem date={date} hours={0} style={{ margin: 0 }}>
        <div style={{ display: 'flex' }}>
            <IssueHeader project={{ id: '', name: 'No Activity' }} style={{ margin: 0, padding: '8px 0' }}/>
            <AddAcivityButton onClick={bind(onActivityAdd, date)} />
        </div>
    </ActivityListItem>
);

type ActivityDayProps = {
    date: Date,
    hours: number,
    issues: Array<[string, TimesheetEntry[]]>,
    onActivityAdd?: (date: Date) => void,
    onActivityClick?: (x: TimesheetEntry) => void,
};
const ActivityDay = ({ date, hours, issues, onActivityAdd, onActivityClick } : ActivityDayProps) => {
    return (
        <ActivityListItem date={date} hours={hours}>
            <div style={{ display: 'flex' }}>
                <AddAcivityButton onClick={bind(onActivityAdd, date)} />
            </div>
            {
                issues.map(([issueId, items]) =>
                    <ActivityIssue key={issueId} items={items} onActivityClick={onActivityClick} />,
                )
            }
        </ActivityListItem>
    );
};


export type ActivityListProps = {
    start: Date,
    end: Date,
    data: Array<TimesheetEntry>,
    onActivityClick?: (x: TimesheetEntry) => void,
    onActivityAddClick?: (date: Date) => void,
};
export const ActivityList = React.memo(
    (props: ActivityListProps) => {
        const data = mapData(props.data);

        const items = Array.from(getRange(props.end, props.start, -1)).map((date) => {
            const key = toISODate(date);

            if (!data.has(key)) {
                return <EmptyActivityDay key={key} date={date} onActivityAdd={props.onActivityAddClick} />;
            }

            const issuesMap = data.get(key) as Map<string, TimesheetEntry[]>;
            const issues = Array.from(issuesMap.entries());
            const dayTotal = countTotalHours(issues);

            return <ActivityDay
                key={key}
                date={date}
                hours={dayTotal}
                issues={issues}
                onActivityAdd={props.onActivityAddClick}
                onActivityClick={props.onActivityClick}
            />;
        });

        return <>{items}</>;
    },
    (prev, next) => {
        if (prev.data === next.data) {
            return true;
        }
        if (prev.data.length === 0 && next.data.length === 0) {
            return true;
        }
        if (prev.data.length !== next.data.length) {
            return false;
        }

        return prev.data.reduce(
            (acc, currentItem, i) => acc && isTimesheetEntryEqual(currentItem, next.data[i]),
            true,
        );
    },
);