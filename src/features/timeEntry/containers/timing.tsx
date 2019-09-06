import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { tryParseDate } from 'shared/date';
import { Danger } from 'components/alert';
import { useAppState, useActions } from 'state';

import { TimingForm } from '../components/timingForm';
import { IssueFilterForm } from '../components/issueFilter';
import { Issues } from './issues';
import { applyFilter, mapFilterToForm, loadIssues, resetIssues } from '../state/issues/actions';
import { addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry, loadTimesheetEntry, resetEntryForm, selectIssue } from '../state/timing/actions';
import { PageLayout } from '../components/layout';
import { bind } from 'shared/utils';
import { Issue } from 'shared/types';

const Filter = () => {
    const filter = useAppState(x => x.issues.filter);
    const enums = useAppState(x => x.enumerations);
    const onSubmit = useActions(applyFilter);

    if (!enums.isLoaded) {
        return null;
    }

    const form = mapFilterToForm(filter || {});

    return <IssueFilterForm enums={enums} onSubmit={onSubmit} filter={form}/>;
};

const Form = (props: { entryId: string, editMode: boolean, onCancel?: () => void }) => {
    const editMode = props.editMode;
    const state = useAppState(x => x.timingsForm);
    const activities = useAppState(x => x.enumerations.activity);

    const actions = useActions({ addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry });

    const data = editMode
    ? state.entry
    : {
        spentOn: getDateQueryParam(),
        issue: state.selectedIssueId === undefined ? undefined : { id: state.selectedIssueId },
    };

    return (
        <>
            <Danger>{state.error}</Danger>
            <TimingForm
                key={data === undefined ? 'empty' : undefined}
                disabled={state.selectedIssueId === undefined}
                loading={state.loading}
                data={data}
                activities={activities}
                submitLabel={editMode ? 'Update' : 'Add'}
                onSubmit={editMode ? actions.updateTimesheetEntry : actions.addTimesheetEntry}
                onClose={props.onCancel}

                showDelete={editMode}
                onDelete={actions.deleteTimesheetEntry}
            />
        </>
    );
};

export const TimingPage = (props: RouteComponentProps<{ id: string }>) => {
    const entryId = props.match.params.id;
    const editMode = entryId !== 'new';

    const success = useAppState(x => x.timingsForm.success);
    const issueId = useAppState(x => x.timingsForm.selectedIssueId);
    const actions = useActions({
        resetEntryForm,
        resetIssues,
        selectIssue: (issue: Issue) => selectIssue(issue.id),
        unselectIssue: bind(selectIssue, undefined),
        refresh: bind(loadIssues),
        loadEntry: loadTimesheetEntry,
    });

    React.useEffect(() => { editMode && actions.loadEntry(entryId); }, [entryId]);
    React.useEffect(
        () => () => {
            actions.resetIssues();
            actions.resetEntryForm();
        },
        [],
    );

    if (success) {
        return <Redirect to="/time" />;
    }
    return (
        <PageLayout
            title={editMode ? 'Update Activity' : 'Add Activity'}
            filter={<Filter />}
            issues={<Issues onSelectIssue={actions.selectIssue} selectedIssueId={issueId} />}
            form={<Form entryId={entryId} editMode={editMode} onCancel={() => props.history.push('/time')} />}
            issueSelected={issueId !== undefined}
            onRefresh={actions.refresh}
            unselectIssue={actions.unselectIssue}
        />
    );
};


function getDateQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    return dateParam === null ? undefined : tryParseDate(dateParam);
}
