import * as React from 'react';

import { NamedId, Issue } from '../../shared/types';
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
            <span className="issue-list-item-project">{issue.project.name}</span>
            <IssueHeader issue={{ id: issue.id, name: issue.subject }} showNumber />
            <div style={{ display: 'flex', marginTop: 32 }}>
                <TagList style={{ zIndex: 1 }}>
                    <Tag name={ issue.status.name || 'status?' }/>
                    <Tag name={ issue.priority.name || 'priority?' }/>
                </TagList>
            </div>
        </>
    );
};

type IssueDetailsProps = {
    issue: Issue,
    visible?: boolean,
};
const IssueDetails = (props: IssueDetailsProps) => {
    return (
        <div className={`issue-list-item-details ${props.visible ? '' : 'hidden' }`}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </div>
    );
};



export type IssueListProps = {
    data: Issue[],
    selectedIssueId?: string,
    onSelect?: (issue: Issue) => void,
    style?: React.CSSProperties,
};
export const IssueList = (props: IssueListProps) => {
    const [selected, setSelected] = React.useState({
        showMore: false as boolean,
        issue: undefined as Issue | undefined,
    });

    const isSelected = (issue: Issue) => {
        if (selected.issue === undefined) {
            return false;
        }
        return issue.id === selected.issue.id;
    };

    return (
        <div className="issue-list" style={props.style}>
            <List>{
                props.data.map((issue) => {
                    const showMore = isSelected(issue) && selected.showMore;
                    const onClick = props.onSelect === undefined ? undefined : () => (props.onSelect as any)(issue);
                    return (
                        <ListItem key={issue.id} onClick={onClick} clickable>
                            <IssueListItem issue={issue} />
                            <IssueDetails issue={issue} visible={showMore} />
                        </ListItem>
                    );
                })
            }</List>
        </div>
    );
}