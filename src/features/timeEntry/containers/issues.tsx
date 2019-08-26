import * as React from 'react';
import { CoverLoader } from 'components/preloader';
import { useAppState } from 'store';
import { useActions } from 'hooks/useActions';
import { IssueList } from '../components/issueList';
import { loadIssues, selectIssue } from '../state/issues/actions';


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
    const actions = useActions({ loadIssues, selectIssue });

    React.useEffect(() => { actions.loadIssues(); }, []);

    return (
        <>
            <CoverLoader active={loading}/>
            <NoData visible={!loading && data.length === 0} />
            <IssueList
                issues={data}
                onSelect={actions.selectIssue}
                selectedIssue={selectedIssue}
            />
        </>
    );
};
