import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { tryParseDate } from 'shared/date';
import { Danger, Success } from 'components/alert';
import { AppState, useAppState, useActions } from 'state';

import { TimingForm } from '../components/timingForm';
import { IssueFilterForm } from '../components/issueFilter';
import { Issues } from './issues';
import { applyFilter, mapFilterToForm, selectIssue, loadIssues, resetIssues } from '../state/issues/actions';
import { addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry, loadTimesheetEntry, resetEntryForm } from '../state/timing/actions';
import { PageLayout } from '../components/layout';
import { bind } from 'shared/utils';

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
    const selectedIssueId = useAppState(selectedIssueIdSelector);
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
        issue: selectedIssueId === undefined ? undefined : { id: selectedIssueId },
    };

    return (
        <>
            <Danger>{state.error}</Danger>
            <Success>{state.success ? 'Success' : undefined}</Success>
            <TimingForm
                key={data === undefined ? 'empty' : undefined}
                disabled={selectedIssueId === undefined}
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
    const actions = useActions({ resetEntryForm, resetIssues, unselectIssue: bind(selectIssue, undefined) });

    const isIssueSelected = useAppState(x => x.issues.selectedIssue !== undefined);
    const refresh = useActions(bind(loadIssues));

    React.useEffect(
        () => {
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
            issues={<Issues />}
            form={<Form entryId={entryId} onCancel={() => props.history.push('/time')} />}
            issueSelected={isIssueSelected}
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

function selectedIssueIdSelector(x: AppState) {
    return x.issues.selectedIssue === undefined
        ? undefined
        : x.issues.selectedIssue.id;
}