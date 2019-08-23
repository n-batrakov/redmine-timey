import * as React from 'react';
import { Container } from '../components/container';
import { RouteComponentProps } from 'react-router';
import { tryParseDate } from '../shared/date';
import { TimingForm } from '../components/timingForm';
import { useSelector } from 'react-redux';
import { AppState, useAppState } from '../store';
import { MobileScreen, MobileScreenHidden } from '../components/mediaQuery';
import { Tabs, TabList, TabPanel, Tab } from '../components/tabs';
import { Issues as IssuesList } from './issues';
import { Issue, Enumeration } from '../shared/types';
import { ToggledIssueFilter, IssueFilterForm, OverflowIssueFilter } from '../components/issueFilter';
import { applyFilter } from '../store/issues/actions';
import { addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry, loadTimesheetEntry, selectIssue } from '../store/timingsForm/actions';
import { Danger, Success } from '../components/alert';
import { useBind } from '../store/useBind';

type PageLayoutProps = {
    filter?: React.ReactNode,
    issues?: React.ReactNode,
    form?: React.ReactNode,
};
const PageLayout = React.memo(
    (props: PageLayoutProps) => {
        const selectedIssueId = useAppState(x => x.timingsForm.selectedIssueId);
        const unselectIssue = useBind(() => selectIssue.bind(undefined, undefined));

        return (
            <>
                <MobileScreen>
                    <Container>
                        <Tabs selectedIndex={selectedIssueId === undefined ? 0 : 1} onSelect={unselectIssue}>
                            <TabList>
                                <Tab>Issue</Tab>
                                <Tab disabled={selectedIssueId === undefined}>Timing</Tab>
                            </TabList>
                            <TabPanel>
                                <ToggledIssueFilter>
                                    {props.filter}
                                </ToggledIssueFilter>
                                {props.issues}
                            </TabPanel>
                            <TabPanel>
                                {props.form}
                            </TabPanel>
                        </Tabs>
                    </Container>
                </MobileScreen>
                <MobileScreenHidden>
                    <div style={{ display: 'flex' }}>
                        <OverflowIssueFilter>
                            {props.filter}
                        </OverflowIssueFilter>
                        <Container inline>
                            <div style={{
                                    height: 'calc(100vh - 2*24px - 38px)',
                                    overflowX: 'auto',
                                    paddingRight: 10,
                                    marginRight: 20,
                                    flex: '1 1 auto',
                                }}
                            >
                                {props.issues}
                            </div>
                            <div style={{ width: 300 }}>
                                {props.form}
                            </div>
                        </Container>
                    </div>
                </MobileScreenHidden>
            </>
        );
    },
    () => false,
);


const Filter = () => {
    const enums = useAppState(x => x.enumerations);
    const onSubmit = useBind(applyFilter);
    return <IssueFilterForm enums={enums} onSubmit={onSubmit} />;
};

const Issues = () => {
    const selectedIssueId = useAppState(x => x.timingsForm.selectedIssueId);
    const onSelect = useBind((x: Issue) => selectIssue(x.id));

    return <IssuesList onSelect={onSelect} selectedIssueId={selectedIssueId} />;
};

function getDateQueryParam() {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('date');
    return dateParam === null ? undefined : tryParseDate(dateParam);
}

type FormProps = { onCancel: () => void };

const Form = (props: FormProps) => {
    const state = useAppState(x => x.timingsForm);
    const activities = useSelector<AppState, Enumeration>(x => x.enumerations.activity);
    const actions = useBind({ addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry });

    if (state.loading) {
        return null;
    }

    const isCreate = state.entry === undefined;
    const data = isCreate
        ? {
            spentOn: getDateQueryParam(),
            issue: state.selectedIssueId === undefined ? undefined : { id: state.selectedIssueId },
        }
        : state.entry;

    return (
        <>
            <Danger>{state.error}</Danger>
            <Success>{state.success ? 'Success' : undefined}</Success>
            <TimingForm
                disabled={state.selectedIssueId === undefined}
                loading={state.loading}
                data={data}
                activities={activities}
                submitLabel={isCreate ? 'Add' : 'Update'}
                onSubmit={isCreate ? actions.addTimesheetEntry : actions.updateTimesheetEntry}
                onClose={props.onCancel}

                showDelete={!isCreate}
                onDelete={actions.deleteTimesheetEntry}
            />
        </>
    );
};

export const TimingPage = (props: RouteComponentProps<{ id: string }>) => {
    const id = props.match.params.id;
    const editMode = id !== 'new';

    const loadEntry = useBind(loadTimesheetEntry);
    React.useEffect(
        () => {
            if (editMode) loadEntry(id);
        },
        [id],
    );

    return (
        <PageLayout
            filter={<Filter />}
            issues={<Issues />}
            form={<Form onCancel={() => props.history.push('/')}/>}
        />
    );
};
