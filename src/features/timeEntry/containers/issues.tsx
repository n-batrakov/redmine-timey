import * as React from 'react';
import { useAppState, useActions } from 'state';
import { IssueList } from '../components/issueList';
import { loadIssues, selectIssue, resetIssues } from '../state/issues/actions';


const NoData = React.memo((props: { visible: boolean }) => {
    return (
        <div style={{ display: props.visible ? undefined : 'none' }}>
            <h2>No data</h2>
            <p>Please, specify different search criteria.</p>
        </div>
    );
});

export const Issues = () => {
    const loading = useAppState(x => x.issues.isLoading);
    const data = useAppState(x => x.issues.data);
    const selectedIssue = useAppState(x => x.issues.selectedIssue);
    const actions = useActions({ loadIssues, selectIssue, resetIssues });

    React.useEffect(
        () => {
            actions.loadIssues();
            return () => { actions.resetIssues(); };
        },
        [],
    );

    return (
        <>
            <NoData visible={!loading && data.length === 0} />
            <IssueList
                loading={loading}
                issues={data}
                onSelect={actions.selectIssue}
                selectedIssue={selectedIssue}
            />
        </>
    );
};
