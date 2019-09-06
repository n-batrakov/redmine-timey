import * as React from 'react';
import { Breadcrumbs, Crumb } from 'components/breadcrumbs';
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
                <Breadcrumbs>
                    <Crumb>
                        <NavLink to="/time" className="activity-list-header-link">Recent Activity</NavLink>
                    </Crumb>
                    <Crumb style={showIf(isDaySelected)}>
                        {props.date === undefined ? '' : props.date.toLocaleDateString()}
                    </Crumb>
                </Breadcrumbs>
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