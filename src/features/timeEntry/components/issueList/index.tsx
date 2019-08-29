import * as React from 'react';

import { Issue } from 'shared/types';
import { IssueHeader } from 'components/issueHeader';
import { List, ListItem } from 'components/list';
import { TagList, Tag } from 'components/tags';


type IssueListItemProps = {
    issue: Issue,
};
const IssueListItem = ({ issue }: IssueListItemProps) => {
    return (
        <>
            <IssueHeader
                issue={{ id: issue.id, name: issue.subject, href: issue.href }}
                project={issue.project}
                showNumber ignoreHref column
            />
            <div style={{ display: 'flex', marginTop: 8 }}>
                <TagList>
                    <Tag name={ issue.status.name || 'status?' }/>
                    <Tag name={ issue.priority.name || 'priority?' }/>
                    <Tag name={ issue.author.name || 'authon?' } />
                </TagList>
            </div>
        </>
    );
};

export type IssueListProps = {
    issues?: Issue[],
    style?: React.CSSProperties,

    selectedIssue?: Issue,
    onSelect?: (issue: Issue) => void,
};
export const IssueList = (props: IssueListProps) => {
    const list = props.issues || [];

    return (
        <List style={props.style}>{
            list.map((issue) => {
                const onClick = props.onSelect === undefined ? undefined : () => (props.onSelect as any)(issue);
                return (
                    <ListItem
                        key={issue.id}
                        onClick={onClick}
                        clickable
                        selected={issuesEqual(issue, props.selectedIssue)}
                    >
                        <IssueListItem issue={issue} />
                    </ListItem>
                );
            })
        }</List>
    );
};

function issuesEqual(a: Issue | undefined, b: Issue | undefined) {
    if (a === b) return true;
    if (a === undefined || b === undefined) return false;

    return a.id === b.id;
}