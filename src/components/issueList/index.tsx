import * as React from 'react';

import { Issue } from '../../shared/types';
import { IssueHeader } from '../issueHeader';
import { List, ListItem } from '../list';
import { TagList, Tag } from '../tags';

import './issueList.css';

type IssueListItemProps = {
    issue: Issue,
};
const IssueListItem = ({ issue }: IssueListItemProps) => {
    return (
        <>
            <IssueHeader
                issue={{ id: issue.id, name: issue.subject, href: issue.href }}
                project={issue.project}
                showNumber ignoreHref
                style={{ margin: 0 }}/>
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
    data: Issue[],
    style?: React.CSSProperties,

    selectedIssueId?: string,
    onSelect?: (issue: Issue) => void,
};
export const IssueList = (props: IssueListProps) => {
    return (
        <List style={props.style}>{
            props.data.map((issue) => {
                const onClick = props.onSelect === undefined ? undefined : () => (props.onSelect as any)(issue);
                return (
                    <ListItem key={issue.id} onClick={onClick} clickable>
                        <IssueListItem issue={issue} />
                    </ListItem>
                );
            })
        }</List>
    );
};