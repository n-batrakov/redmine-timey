import * as React from 'react';
import { useAppState, useActions } from 'state';
import { IssueList } from '../components/issueList';
import { loadIssues, resetIssues } from '../state/issues/actions';
import { Issue } from 'shared/types';
import { useScrollIntoSelectedElement } from 'components/list';


const NoData = React.memo((props: { visible: boolean }) => {
    return (
        <div style={{ display: props.visible ? undefined : 'none' }}>
            <h2>No data</h2>
            <p>Please, specify different search criteria.</p>
        </div>
    );
});

export type IssuesProps = {
    selectedIssueId?: string,
    onSelectIssue?: (issue: Issue) => void,
}

export const Issues = (props: IssuesProps) => {
    const loading = useAppState(x => x.issues.isLoading);
    const data = useAppState(x => x.issues.data);
    const actions = useActions({ loadIssues, resetIssues });

    React.useEffect(() => { actions.loadIssues(); }, []);

    useScrollIntoSelectedElement([data]);

    return (
        <>
            <NoData visible={!loading && data.length === 0} />
            <IssueList
                loading={loading}
                issues={data}
                onSelect={props.onSelectIssue}
                selectedIssueId={props.selectedIssueId}
            />
        </>
    );
};
