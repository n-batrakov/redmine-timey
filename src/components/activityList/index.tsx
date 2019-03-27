import * as React from 'react';
import { getRange, toISODate } from '../../shared/date';
import { TimesheetEntry, NamedId } from '../../shared/types';
import './activityList.css';

export type ActivityListProps = {
    start: Date,
    end: Date,
    data: Array<TimesheetEntry>,
    onActivityClick?: (x: TimesheetEntry) => void,
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wedsday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatDate = (date: Date): string => {
    const dayNumber = date.getDate();
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];

    return `${dayName} (${dayNumber} ${monthName})`;
};

function mapData({ data }: ActivityListProps) {
    return data.reduce(
        (acc, x) => {
            const key = toISODate(x.spentOn);
            let issuesMap = acc.get(key);

            if (issuesMap === undefined) {
                issuesMap = new Map();
                acc.set(key, issuesMap);
            }

            const issueKey = `${x.project.name} / ${x.issue === undefined ? '' : x.issue.name}`;
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

const ActivityTiming = (x: { entry: TimesheetEntry, onClick?: (x: TimesheetEntry) => void }) => (
    <li className="list-comment" onClick={() => x.onClick === undefined ? undefined : x.onClick(x.entry)}>
        {x.entry.comments}
        <span>{x.entry.hours} h.</span>
    </li>
);

type IssueHeaderProps = {
    project: NamedId,
    issue?: NamedId,
};
const getLink = ({ name, href }: NamedId) => {
    return href === undefined
        ? name
        : <a href={href}>{name}</a>;
};
const IssueHeader = (x: IssueHeaderProps) => {
    const project = getLink(x.project);

    if (x.issue === undefined) {
        return <h3>{project}</h3>;
    }

    const issue = getLink(x.issue);

    return <h3>{project} / {issue}</h3>;
};

const ActivityDay = ({ date, hours, children }: {date: Date, hours: number, children?: React.ReactNode}) => (
    <div className="list-day">
        <h2><span>{formatDate(date)} - {hours} hours</span></h2>
        {children}
    </div>
);

export class ActivityList extends React.Component<ActivityListProps> {
    public render() {
        const data = mapData(this.props);

        return Array.from(getRange(this.props.end, this.props.start, -1)).map((date) => {
            let dayTotal = 0;
            const isodate = toISODate(date);
            const issuesGroups = data.get(isodate);

            if (issuesGroups === undefined) {
                return (
                    <ActivityDay key={isodate} date={date} hours={dayTotal}>
                        <div className="list-issue">
                            <h3>No activity</h3>
                        </div>
                    </ActivityDay>
                );
            }

            const issues = Array.from(issuesGroups.entries()).map(([issueId, items]) => {
                const project = items[0].project;
                const issue = items[0].issue;
                const timings = items.map((x) => {
                    dayTotal += x.hours;
                    return <ActivityTiming key={x.id} entry={x} onClick={this.props.onActivityClick}/>;
                });

                return (
                    <div key={issueId} className="list-issue">
                        <IssueHeader project={project} issue={issue}/>
                        <ul>{timings}</ul>
                    </div>
                );
            });

            return (
                <ActivityDay key={isodate} date={new Date(Date.parse(isodate))} hours={dayTotal}>
                    {issues}
                </ActivityDay>
            );
        });
    }
}