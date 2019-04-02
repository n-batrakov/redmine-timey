import * as React from 'react';

import { IssueList, IssueListProps } from '../issueList';
import { Issue } from '../../shared/types';

export type IssueSelectionFormProps = {
    onIssueSelected?: (issue: Issue) => void,
    onClose?: () => void,
};
export const IssueSelectionForm = (props: IssueSelectionFormProps) => (
    <>
        <IssueList
            data={new Array(50).fill(0).map<Issue>((_, i) => ({
                id: i.toString(),
                subject: 'Issue',
                author: { id: '0', name: 'admin' },
                assignedTo: { id: '1', name: 'n.batrakov' },
                createdOn: new Date(Date.UTC(2019, 2, 1)),
                updatedOn: new Date(Date.UTC(2019, 3, 1)),
                description: 'Lorem Ipsum',
                priority: { id: '0', name: 'Normal' },
                project: { id: '0', name: 'Long Long Long Long Long Long Long Long Long Long Long Project Name' },
                status: { id: '0', name: 'New' },
            }))}
            onSelect={props.onIssueSelected}
            style={{ maxHeight: 560, overflow: 'auto' }}
        />
        <div style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: 32 }}>
            <button
                className="btn"
                onClick={props.onClose}>Cancel</button>
        </div>
    </>
);