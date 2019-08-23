import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useSelector } from 'react-redux';
import { tryParseDate } from '../shared/date';
import { bind } from '../shared';

import { Container } from '../components/container';
import { TimingForm } from '../components/timingForm';
import { MobileScreen, MobileScreenHidden } from '../components/mediaQuery';
import { Tabs, TabList, TabPanel, Tab } from '../components/tabs';
import { ToggledIssueFilter, IssueFilterForm, OverflowIssueFilter } from '../components/issueFilter';
import { Danger, Success } from '../components/alert';
import { Issues } from './issues';

import { AppState, useAppState } from '../store';
import { Enumeration } from '../shared/types';
import { applyFilter, selectIssue, loadIssues } from '../store/issues/actions';
import { addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry, loadTimesheetEntry } from '../store/timingsForm/actions';
import { useBind } from '../store/useBind';


type PageLayoutProps = {
    filter?: React.ReactNode,
    issues?: React.ReactNode,
    form?: React.ReactNode,
};
const PageLayout = React.memo(
    (props: PageLayoutProps) => {
        const noIssue = useAppState(x => x.issues.selectedIssue === undefined);
        const unselectIssue = useBind(() => selectIssue.bind(undefined, undefined));
        const refresh = useBind(bind(loadIssues));

        return (
            <>
                <MobileScreen>
                    <Container>
                        <Tabs selectedIndex={noIssue ? 0 : 1} onSelect={unselectIssue}>
                            <TabList>
                                <Tab>Issue</Tab>
                                <Tab disabled={noIssue}>Timing</Tab>
                            </TabList>
                            <TabPanel>
                                <ToggledIssueFilter>{props.filter}</ToggledIssueFilter>
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
                        <OverflowIssueFilter onRefresh={refresh}>{props.filter}</OverflowIssueFilter>
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

    if (!enums.isLoaded) {
        return null;
    }

    return <IssueFilterForm enums={enums} onSubmit={onSubmit} filter={{ assigned: 'me' }}/>;
};



type FormProps = { onCancel: () => void };

const Form = (props: FormProps) => {
    const state = useAppState(x => x.timingsForm);
    const selectedIssueId = useAppState(selectedIssueIdSelector);
    const activities = useSelector<AppState, Enumeration>(x => x.enumerations.activity);
    const actions = useBind({ addTimesheetEntry, updateTimesheetEntry, deleteTimesheetEntry });

    if (state.loading) {
        return null;
    }

    const isCreate = state.entry === undefined;
    const data = isCreate
        ? {
            spentOn: getDateQueryParam(),
            issue: selectedIssueId === undefined ? undefined : { id: selectedIssueId },
        }
        : state.entry;

    return (
        <>
            <Danger>{state.error}</Danger>
            <Success>{state.success ? 'Success' : undefined}</Success>
            <TimingForm
                disabled={selectedIssueId === undefined}
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