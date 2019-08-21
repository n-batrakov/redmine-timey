import * as React from 'react';
import { Container } from '../components/container';
import { RouteComponentProps } from 'react-router';
import { tryParseDate } from '../shared/date';
import { TimingForm } from '../components/timingForm';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { MobileScreen, MobileScreenHidden } from '../components/mediaQuery';
import { Tabs, TabList, TabPanel, Tab } from '../components/tabs';
import { Issues } from './issues';
import { EnumerationsState } from '../store/enumerations/types';
import { Issue, TimesheetEntry } from '../shared/types';
import { ToggledIssueFilter, IssueFilterForm, OverflowIssueFilter } from '../components/issueFilter';
import { applyFilter } from '../store/issues/actions';
import { IssueFilterValue } from '../store/issues/types';
import { addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry, loadTimesheetEntry, selectIssue } from '../store/timingsForm/actions';
import { Danger, Success } from '../components/alert';

const onTabChange = (props: { selectIssue?: (x?: string) => void }) => React.useCallback(
    () => props.selectIssue === undefined ? undefined : props.selectIssue(undefined),
    [props.selectIssue],
);

const onSelectIssue = (props: { selectIssue?: (x?: string) => void }) => React.useCallback(
    (issue: Issue) => props.selectIssue === undefined ? undefined : props.selectIssue(issue.id),
    [props.selectIssue],
);

const onDeleteTiming = (props: EditTimingPageProps)  => React.useCallback(
    (id: string) => {
        props.deleteTimesheetEntry(id);
        props.history.replace('new');
    },
    [],
);

type PageProps = RouteComponentProps & {
    loading?: boolean,
    error?: string,
    success?: boolean,
    enumerations: EnumerationsState,

    selectedIssueId?: string,
    selectIssue?: (id?: string) => void,

    entry?: Partial<TimesheetEntry>,
    onSubmit?: (form: Partial<TimesheetEntry>) => void,
    applyFilter?: (filter?: IssueFilterValue) => void,
    onDelete?: (id: string) => void,
};
const Page = ({ selectedIssueId, ...props }: PageProps) => {
    const enums = props.enumerations;
    const onSelect = onSelectIssue(props);

    const form = (
        <>
            <Danger>{props.error}</Danger>
            <Success>{props.success ? 'Success' : undefined}</Success>
            <TimingForm
                data={props.entry}
                activities={enums.activity}
                onClose={props.history.goBack}
                onSubmit={props.onSubmit}
                loading={props.loading}
                disabled={selectedIssueId === undefined}
                showDelete={props.onDelete !== undefined}
                onDelete={props.onDelete}
            />
        </>
    );

    return (
        <>
            <MobileScreen>
                <Container>
                    <Tabs selectedIndex={selectedIssueId === undefined ? 0 : 1} onSelect={onTabChange(props)}>
                        <TabList>
                            <Tab>Issue</Tab>
                            <Tab disabled={selectedIssueId === undefined}>Timing</Tab>
                        </TabList>
                        <TabPanel>
                            <ToggledIssueFilter>
                                <IssueFilterForm enums={enums} onSubmit={props.applyFilter} />
                            </ToggledIssueFilter>
                            <Issues onSelect={onSelect} selectedIssueId={selectedIssueId} />
                        </TabPanel>
                        <TabPanel>{form}</TabPanel>
                    </Tabs>
                </Container>
            </MobileScreen>
            <MobileScreenHidden>
                <div style={{ display: 'flex' }}>
                    <OverflowIssueFilter>
                        <IssueFilterForm enums={enums} onSubmit={props.applyFilter} />
                    </OverflowIssueFilter>
                    <Container inline>
                        <Issues
                            onSelect={onSelect}
                            selectedIssueId={selectedIssueId}
                            style={{
                                maxWidth: '60%',
                                height: 'calc(100vh - 2*24px - 38px)',
                                overflowX: 'auto',
                                paddingRight: 10,
                            }}
                        />
                        <div style={{ width: 500, padding: '0 20px' }}>
                            {form}
                        </div>
                    </Container>
                </div>
            </MobileScreenHidden>
        </>
    );
};


export type EditTimingPageProps = RouteComponentProps<{id: string}> & {
    loading: boolean,
    error: string,
    success: boolean,
    entry?: TimesheetEntry,
    enumerations: EnumerationsState,
    applyFilter: (filter?: IssueFilterValue) => void,
    loadTimesheetEntry: (id: string) => void,
    updateTimesheetEntry: (entry: Partial<TimesheetEntry>) => void,
    deleteTimesheetEntry: (id: string) => void,
    selectedIssueId?: string,
    selectIssue: (id?: string) => void,
};

const EditTimingContainer = (props: EditTimingPageProps) => {
    const id = props.match.params.id;
    React.useEffect(() => { props.loadTimesheetEntry(id); }, []);
    const onDelete = onDeleteTiming(props);

    if (props.entry === undefined) {
        return null;
    }

    const entryIssue = props.entry.issue === undefined ? undefined : props.entry.issue.id;
    const selectedIssueId = props.selectedIssueId || entryIssue;

    return (
        <Page
            {...props}
            selectedIssueId={selectedIssueId}
            selectIssue={props.selectIssue}
            onSubmit={props.updateTimesheetEntry}
            onDelete={onDelete}
        />
    );
};
export const EditTimingPage = connect(
    (state: AppState, props: Partial<EditTimingPageProps>): Partial<EditTimingPageProps> => ({
        ...props,
        enumerations: state.enumerations,
        error: state.timingsForm.error,
        loading: state.timingsForm.loading,
        success: state.timingsForm.success,
        entry: state.timingsForm.entry,
        selectedIssueId: state.timingsForm.selectedIssueId,
    }),
    {
        applyFilter,
        updateTimesheetEntry,
        deleteTimesheetEntry,
        loadTimesheetEntry,
        selectIssue,
    },
)(EditTimingContainer);



export type CreateTimingPageProps = RouteComponentProps<{id: string}> & {
    loading: boolean,
    error: string,
    success: boolean,
    enumerations: EnumerationsState,
    applyFilter: (filter?: IssueFilterValue) => void,
    addTimesheetEntry: (e: TimesheetEntry) => void,
    selectedIssueId?: string,
    selectIssue: (id?: string) => void,
};

const CreatePage = (props: CreateTimingPageProps) => {
    const params = new URLSearchParams(props.location.search);
    const dateParam = params.get('date');
    const spentOn = dateParam === null ? undefined : tryParseDate(dateParam);
    const entry: Partial<TimesheetEntry> = props.selectedIssueId === undefined
        ? { spentOn }
        : { spentOn, issue: { id: props.selectedIssueId } };

    return (
        <Page
            {...props}
            entry={entry}
            onSubmit={props.addTimesheetEntry}
            selectedIssueId={props.selectedIssueId}
            selectIssue={props.selectIssue}
        />
    );
};

export const CreateTimingPage = connect(
    (state: AppState, props: Partial<CreateTimingPageProps>): Partial<CreateTimingPageProps> => ({
        ...props,
        enumerations: state.enumerations,
        error: state.timingsForm.error,
        loading: state.timingsForm.loading,
        success: state.timingsForm.success,
        selectedIssueId: state.timingsForm.selectedIssueId,
    }),
    {
        applyFilter,
        addTimesheetEntry,
        loadTimesheetEntry,
        selectIssue,
    },
)(CreatePage);
