import * as React from 'react';
import { render } from 'react-dom';

type ActivityListItem = {
    id: string,
    spentOn: Date,
    project: { id: string, name: string },
    issue?: { id: string, name: string },
    comments: string,
    hours: number,
};

export type ActivityListProps = {
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
            const key = x.spentOn.toISOString();
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

export class ActivityList extends React.Component<ActivityListProps> {
    public render() {
        const data = mapData(this.props);

        return Array.from(data.entries()).map(([date, tasksGroups]) => {
            let dayTotal = 0;

            const tasks = Array.from(tasksGroups.entries()).map(([task, items]) => {
                const taskTotal = items.reduce((acc, x) => acc + x.hours, 0);
                dayTotal += taskTotal;

                const comments = items.map(x => <ActivityTaskComment key={x.id} {...x}/>);

                return (
                    <div key={task} className="list-task">
                        <h3>{task}</h3>
                        <ul>{comments}</ul>
                    </div>
                );
            });

            return (
                <div key={date} className="list-day">
                    <h2><span>{formatDate(new Date(Date.parse(date)))} - {dayTotal} hours</span></h2>
                    {tasks}
                </div>
            );
        });
    }
}