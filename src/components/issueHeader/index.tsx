import './index.scss';
import * as React from 'react';
import { NamedId } from '../../shared/types';

type IssueHeaderData = {
    project?: NamedId,
    issue?: NamedId,
};

export type IssueHeaderProps = IssueHeaderData & {
    column?: boolean,
    showNumber?: boolean,
    ignoreHref?: boolean,
};

const getProjectTitle = ({ name }: NamedId) => {
    return <span className="project-title">{name}</span>;
};

const getIssueTitle = ({ id, name, href }: NamedId, showId: boolean, ignoreHref: boolean) => {
    const title = showId ? `#${id} ${name}` : name;
    return <a className="issue-title" href={ignoreHref ? undefined : href}>{title}</a>;
};

export const IssueHeader = (x: IssueHeaderProps) => {
    const ignoreHref = x.ignoreHref || false;

    const project = x.project === undefined ? null : getProjectTitle(x.project);
    const issue = x.issue === undefined ? null : getIssueTitle(x.issue, x.showNumber || false, ignoreHref);

    return (
        <div className={`issue-header ${x.column ? 'column' : 'inline'}`}>
            {project}{issue}
        </div>
    );
};
