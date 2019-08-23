import * as React from 'react';
import { IssueList } from '../components/issueList';
import { CoverLoader } from '../components/preloader';
import { loadIssues, selectIssue } from '../store/issues/actions';
import { useAppState } from '../store';
import { useActions } from '../hooks/useActions';


const NoData = React.memo((props: { visible: boolean }) => {
    return (
        <div style={{ display: props.visible ? undefined : 'none' }}>
            <h2>No data</h2>
            <p>Please, specify different search criteria.</p>
        </div>
    );
});

export const Issues = () => {
    const state = useAppState(x => x.issues);
    const actions = useActions({ loadIssues, selectIssue });

    React.useEffect(() => { actions.loadIssues(); }, []);

    return (
        <>
            <CoverLoader active={state.isLoading}/>
            <NoData visible={!state.isLoading && state.data.length === 0} />
            <IssueList
                issues={state.data}
                onSelect={actions.selectIssue}
                selectedIssue={state.selectedIssue}
            />
        </>
    );
};
