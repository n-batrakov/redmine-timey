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

export type EditTimingPageProps = RouteComponentProps<{id: string}> & {
    enumerations: EnumerationsState,
    applyFilter: (filter?: IssueFilterValue) => void,
};
const EditTimingContainer = (props: EditTimingPageProps) => {
    const id = props.match.params.id;

    return (
        <Container>
            <TimingForm showDelete activities={props.enumerations.activity} />
        </Container>
    );
};
export const EditTimingPage = connect(
    (state: AppState, props: Partial<EditTimingPageProps>): Partial<EditTimingPageProps> => ({
        ...props,
        enumerations: state.enumerations,
    }),
    {},
)(EditTimingContainer);


const CreatePage = (props: EditTimingPageProps) => {
    const params = new URLSearchParams(props.location.search);
    const dateParam = params.get('date');
    const spentOn = dateParam === null ? undefined : tryParseDate(dateParam);

    const enums = props.enumerations;

    const [selectedIssue, selectIssue] = React.useState(undefined as Issue | undefined);

    const form: Partial<TimesheetEntry> = selectedIssue === undefined
        ? { spentOn }
        : {
            spentOn,
            project: selectedIssue.project,
            issue: { id: selectedIssue.id, name: selectedIssue.subject },
        };

    return (
        <>
            <MobileScreen>
                <Container>
                    <Tabs selectedIndex={selectedIssue === undefined ? 0 : 1} onSelect={() => selectIssue(undefined)}>
                        <TabList>
                            <Tab>Issue</Tab>
                            <Tab disabled={selectedIssue === undefined}>Timing</Tab>
                        </TabList>
                        <TabPanel>
                            <ToggledIssueFilter>
                                <IssueFilterForm enums={enums} onSubmit={props.applyFilter} />
                            </ToggledIssueFilter>
                            <Issues onSelect={selectIssue}/>
                        </TabPanel>
                        <TabPanel>
                            <TimingForm activities={enums.activity} onClose={props.history.goBack} />
                        </TabPanel>
                    </Tabs>
                </Container>
            </MobileScreen>
            <MobileScreenHidden>
                <div style={{ display: 'flex' }}>
                    <OverflowIssueFilter>
                        <IssueFilterForm enums={enums} onSubmit={props.applyFilter} />
                    </OverflowIssueFilter>
                    <Container inline>
                        <Issues onSelect={selectIssue} style={{
                            maxWidth: '60%',
                            height: '95vh',
                            overflowX: 'auto',
                            paddingRight: 10,
                        }}/>
                        <TimingForm
                            activities={enums.activity}
                            onClose={props.history.goBack}
                            data={form}
                            style={{ width: 500 }}
                        />
                    </Container>
                </div>
            </MobileScreenHidden>
        </>
    );
};

export const CreateTimingPage = connect(
    (state: AppState, props: Partial<EditTimingPageProps>): Partial<EditTimingPageProps> => ({
        ...props,
        enumerations: state.enumerations,
    }),
    {
        applyFilter,
    },
)(CreatePage);