import * as React from 'react';
import { NavLink } from 'react-router-dom';

const showIf = (condition: boolean): React.CSSProperties | undefined => condition ? undefined : { display: 'none' };

export type ActivityListHeaderProps = {
    date?: Date,
    style?: React.CSSProperties,
};
export const ActivityListHeader = React.memo(
    (props: ActivityListHeaderProps) => {
        const isDaySelected = props.date !== undefined;
        return (
            <h1 className="activity-list-header" style={props.style}>
                <NavLink to="/time" className="header-item">Recent Activity</NavLink>
                <span className="header-item" style={showIf(isDaySelected)}>
                    {props.date === undefined ? '' : props.date.toLocaleDateString()}
                </span>
            </h1>
        );
    },
    (a, b) => {
        if (a.date === b.date) {
            return true;
        }
        if (a.date === undefined || b.date === undefined)  {
            return false;
        }

        return a.date.getTime() === b.date.getTime();
    });