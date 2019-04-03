import * as React from 'react';

import { NamedId } from '../../shared/types';

type IssueHeaderData = {
    project: NamedId,
} | {
    issue: NamedId,
} | {
    project: NamedId,
    issue: NamedId,
};

export type IssueHeaderProps = IssueHeaderData & {
    style?: React.CSSProperties,
    onClick?: () => void,
    showNumber?: boolean,
    ignoreHref?: boolean,
};

const linkStyles: React.CSSProperties = {
    color: '#000',
    textDecoration: 'none',
};

const getProjectTitle = ({ name, href }: NamedId, ignoreHref: boolean) => {
    return href === undefined || ignoreHref ? name : <a href={href} style={linkStyles}>{name}</a>;
};

const getIssueTitle = ({ id, name, href }: NamedId, showId: boolean, ignoreHref: boolean) => {
    const title = showId ? `#${id} ${name}` : name;
    return href === undefined || ignoreHref ? title : <a href={href} style={linkStyles}>{title}</a>;
};

const getHeaderContent = (x: IssueHeaderProps) => {
    const ignoreHref = x.ignoreHref || false;

    const project = (x as any).project;
    const showProject = project !== undefined;
    const projectElement = showProject ? getProjectTitle(project, ignoreHref) : undefined;

    const issue = (x as any).issue;
    const hasIssue = issue !== undefined;
    const issueElement = hasIssue ? getIssueTitle(issue, x.showNumber || false, ignoreHref) : undefined;

    if (showProject && hasIssue) {
        return <>{projectElement} / {issueElement}</>;
    } else if (hasIssue) {
        return <>{issueElement}</>;
    } else if (showProject) {
        return <>{projectElement}</>;
    }
};

export const IssueHeader = (x: IssueHeaderProps) => {
    return (
        <h3 onClick={x.onClick} style={{
            fontSize: '1em',
            fontWeight: 'normal',
            ...x.style,
        }}>
            {getHeaderContent(x)}
        </h3>
    );
};