import './index.scss';
import * as React from 'react';

import { IssueHeader } from 'components/issueHeader';

import { getRange, toISODate } from 'shared/date';
import { TimesheetEntry, isTimesheetEntryEqual } from 'shared/types';
import { NavLink } from 'react-router-dom';
import { IconEdit } from 'components/icon';
import { ListItem, List } from 'components/list';

const NoData = () => (
    <ListItem className="activity placeholder" inline><h4>No activity</h4></ListItem>
);

type ActivityIssueProps = {
    items: TimesheetEntry[],
    onActivityClick?: (x: TimesheetEntry) => void,
};
const ActivityIssue = (props : ActivityIssueProps) => {
    const project = props.items[0].project;
    const issue = props.items[0].issue;

    return (
        <>
        {
            props.items.map(x => (
                <ListItem key={x.id} className="activity" style={{ minHeight: 78 }} inline>
                    <div className="prepend">
                        {x.hours} h.
                    </div>
                    <div className="issue-container">
                        <h5 className="header"><IssueHeader project={project} issue={issue} showNumber column/></h5>
                        <div className="content">{x.comments}</div>
                    </div>
                    <NavLink className="action btn-edit" to={`/time/${x.id}`} title="Edit entry">
                        <IconEdit />
                    </NavLink>
                </ListItem>
            ))
        }
        </>
    );
};



type ActivityDayProps = {
    date: Date,
    hours?: number,
    issues?: Array<[string, TimesheetEntry[]]>,
    onActivityAdd?: (date: Date) => void,
    onActivityClick?: (x: TimesheetEntry) => void,
};

const ActivityDay = (props : ActivityDayProps) => {
    const issues = props.issues || [];

    return (
        <div className="day">
            <div className="day-header">
                <h5>{formatDate(props.date)} - {props.hours || 0} hours</h5>
                <NavLink className="btn-add" to={`/time/new?date=${toISODate(props.date)}`}>Add Activity</NavLink>
            </div>
            <List>
            {
                issues.length === 0
                ? <NoData />
                : issues.map(([issueId, items]) =>
                    <ActivityIssue
                        key={issueId}
                        items={items}
                        onActivityClick={props.onActivityClick}
                    />,
                )
            }
            </List>
        </div>
    );
};


export type ActivityListProps = {
    start: Date,
    end: Date,
    data?: Array<TimesheetEntry>,
    onActivityClick?: (x: TimesheetEntry) => void,
    onActivityAddClick?: (date: Date) => void,
};
export const ActivityList = React.memo(
    (props: ActivityListProps) => {
        const data = mapData(props.data || []);

        const items = Array.from(getRange(props.end, props.start, -1)).map((date) => {
            const key = toISODate(date);

            if (!data.has(key)) {
                return <ActivityDay key={key} date={date} onActivityAdd={props.onActivityAddClick} />;
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

        return (
            <div className="activity-list">
                {items}
            </div>
        );
    },
    (prev, next) => {
        if (prev.data === next.data) {
            return true;
        }
        if (prev.data === undefined || next.data === undefined) {
            return false;
        }

        if (prev.data.length === 0 && next.data.length === 0) {
            return true;
        }
        if (prev.data.length !== next.data.length) {
            return false;
        }

        return prev.data.reduce(
            (acc, currentItem, i) => acc && isTimesheetEntryEqual(currentItem, next.data![i]),
            true,
        );
    },
);




const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wedsday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(date: Date): string {
    const dayNumber = date.getDate();
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];

    return `${dayName}, ${dayNumber} ${monthName}`;
}

function countTotalHours(issues: Array<[string, TimesheetEntry[]]>) {
    const countIssueHours = (x: TimesheetEntry[]) => x.reduce((a, b) => a + b.hours, 0);

    return issues.reduce((acc, [_, x]) => acc + countIssueHours(x), 0);
}

function mapData(data: TimesheetEntry[]) {
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
}