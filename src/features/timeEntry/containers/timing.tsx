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

const Form = (props: { entryId: string, onCancel?: () => void }) => {
    const editMode = props.entryId !== 'new';
    const state = useAppState(x => x.timingsForm);
    const activities = useAppState(x => x.enumerations.activity);

    const actions = useActions({ addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry, loadTimesheetEntry });

    React.useEffect(
        () => {
            if (editMode) {
                actions.loadTimesheetEntry(props.entryId);
            }
        },
        [props.entryId],
    );

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
    const success = useAppState(x => x.timingsForm.success);
    const actions = useActions({
        resetEntryForm,
        resetIssues,
        selectIssue: (issue: Issue) => selectIssue(issue.id),
        unselectIssue: bind(selectIssue, undefined),
    });

    const selectedIssue = useAppState(x => x.timingsForm.selectedIssueId);
    const refresh = useActions(bind(loadIssues));

    React.useEffect(
        () => () => {
            actions.resetIssues();
            actions.resetEntryForm();
        },
        [],
    );
    if (success) return <Redirect to="/time" />;

    const entryId = props.match.params.id;

    return (
        <PageLayout
            title={entryId === 'new' ? 'Add Activity' : 'Update Activity'}
            filter={<Filter />}
            issues={<Issues onSelectIssue={actions.selectIssue} selectedIssueId={selectedIssue} />}
            form={<Form entryId={entryId} onCancel={() => props.history.push('/time')} />}
            issueSelected={selectIssue !== undefined}
            onRefresh={refresh}
            unselectIssue={actions.unselectIssue}
        />
    );
};


function getDateQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    return dateParam === null ? undefined : tryParseDate(dateParam);
}
