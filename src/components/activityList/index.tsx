import * as React from 'react';
import { getRange, toISODate } from '../../date';

type ActivityListItem = {
    id: string,
    spentOn: Date,
    project: { id: string, name: string },
    issue?: { id: string, name: string },
    comments: string,
    hours: number,
};

export type ActivityListProps = {
    start: Date,
    end: Date,
    taskHref?: (id: string) => string,
    data: Array<ActivityListItem>,
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wedsday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatDate = (date: Date): string => {
    const dayNumber = date.getDate();
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];

    return `${monthName} ${dayNumber} (${dayName})`;
}

function mapData({ data }: ActivityListProps) {
    return data.reduce(
        (acc, x) => {
            const key = toISODate(x.spentOn);
            let tasksMap = acc.get(key);

            if (tasksMap === undefined) {
                tasksMap = new Map();
                acc.set(key, tasksMap);
            }

            const taskKey = `${x.project.name} / ${x.issue === undefined ? '' : x.issue.name}`;
            const taskGroup = tasksMap.get(taskKey);

            if (taskGroup === undefined) {
                tasksMap.set(taskKey, [x]);
            } else {
                taskGroup.push(x);
            }

            return acc;
        },
        new Map<string, Map<string, ActivityListItem[]>>(),
    );
}

const ActivityTaskComment = (x: {id: string, comments: string, hours: number}) => (
    <li className="list-comment">
        {x.comments}
        <span>{x.hours} h.</span>
    </li>
);

const IssueHeader = (x: {project: {id: string, name: string}, issue?: {id: string, name: string}, taskHref?: (id: string) => string}) => {
    if (x.issue === undefined) {
        return <h3>{x.project.name}</h3>;
    }

    if (x.taskHref === undefined) {
        return <h3>{`${x.project.name} / ${x.issue.name}`}</h3>;
    }

    const href = x.taskHref(x.issue.id);
    return <h3>{x.project.name}<a href={href}>{x.issue.name}</a></h3>;
};

const ActivityDay = ({date, hours, children}: {date: Date, hours: number, children?: React.ReactNode}) => (
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
            const dateStr = toISODate(date);
            const tasksGroups = data.get(dateStr);

            if (tasksGroups === undefined) {
                return (
                    <ActivityDay key={dateStr} date={date} hours={dayTotal}>
                        <div className="list-task">
                            <h3>No activity</h3>
                        </div>
                    </ActivityDay>
                );
            }

            const tasks = Array.from(tasksGroups.entries()).map(([task, items]) => {
                const taskTotal = items.reduce((acc, x) => acc + x.hours, 0);
                dayTotal += taskTotal;

                const project = items[0].project;
                const issue = items[0].issue;
                const comments = items.map(x => <ActivityTaskComment key={x.id} {...x}/>);

                return (
                    <div key={task} className="list-task">
                        <IssueHeader project={project} issue={issue} taskHref={this.props.taskHref}/>
                        <ul>{comments}</ul>
                    </div>
                );
            });

            return (
                <ActivityDay key={dateStr} date={new Date(Date.parse(dateStr))} hours={dayTotal}>
                    {tasks}
                </ActivityDay>
            );
        });
    }
}