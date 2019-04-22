import './editTimingModal.css';

import * as React from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { TimesheetEntryForm } from './timesheetEntryForm';
import { NamedId, TimesheetEntry, EnumerationsLookup, Issue } from '../../shared/types';
import { DataSource } from '../../shared/dataSource';
import { Issues } from '../../containers/issues';
import { Button } from '../button';

const onModalClose = () => false;

export type EditTimingModalProps = {
    opened?: boolean,
    data: TimesheetEntry,
    enumerations: EnumerationsLookup,
    onUpdate?: (
        entry: TimesheetEntry,
        finish: () => void,
        onSubmit: (messages: string[]) => void,
    ) => void,
    onDelete?: (
        entryId: string,
        finish: () => void,
        onSubmit: (messages: string[]) => void,
    ) => void,
    onClose?: () => void,
};
export const EditTimingModal = (props: EditTimingModalProps) => {
    return (
        <Modal
            isOpen={props.opened || false}
            onRequestClose={onModalClose}
            className="edit-timing-modal"
        >
            <Tabs defaultIndex={1}>
                <TabList>
                    <Tab disabled>Issue</Tab>
                    <Tab>Timing</Tab>
                </TabList>
                <TabPanel></TabPanel>
                <TabPanel>
                    <TimesheetEntryForm
                        data={props.data}
                        activities={props.enumerations.activity}
                        onClose={props.onClose}
                        onSubmit={props.onUpdate}
                        onDelete={props.onDelete}
                        showDelete
                    />
                </TabPanel>
            </Tabs>
        </Modal>
    );
};


export type CreateTimingModalProps = {
    enumerations: EnumerationsLookup,
    issueSource: DataSource<{}, Issue>,
    opened?: boolean,
    onCreate?: (
        entry: TimesheetEntry,
        finish: () => void,
        onSubmit: (messages: string[]) => void,
    ) => void,
    onClose?: () => void,
    defaultValue?: {
        hours?: number,
        spentOn?: Date,
        project?: NamedId,
        issue?: NamedId,
    },
};
type SelectedIssue = {
    issue?: NamedId,
    project: NamedId,
};
export const CreateTimingModal = (props: CreateTimingModalProps) => {
    const defaultValue = props.defaultValue || {};
    const [{ tabIndex, selectedIssue }, setState] = React.useState({
        tabIndex: 0,
        selectedIssue: {
            issue: defaultValue.issue,
            project: defaultValue.project,
        },
    });

    const isIssueSelected = selectedIssue.issue !== undefined || selectedIssue.project !== undefined;

    const onClose = () => {
        setState({ tabIndex: 0, selectedIssue: { issue: undefined, project: undefined } });
        if (props.onClose !== undefined) {
            props.onClose();
        }
    };

    const getEntry = (x: SelectedIssue) => ({
        id: '',
        comments: '',
        hours: defaultValue.hours || 0,
        spentOn: defaultValue.spentOn || new Date(),
        project: x.project,
        issue: x.issue,
        user: { id: '' },
        activity: { id: '' },
    }) as TimesheetEntry;

    return (
        <Modal
            isOpen={props.opened || false}
            onRequestClose={onModalClose}
            className="edit-timing-modal"
        >
            <Tabs selectedIndex={tabIndex} onSelect={idx => setState({ selectedIssue, tabIndex: idx })}>
                <TabList>
                    <Tab>Issue</Tab>
                    <Tab disabled={!isIssueSelected}>Timing</Tab>
                </TabList>
                <TabPanel>
                    <Issues
                        onSelect={x => setState({
                            selectedIssue: {
                                issue: { id: x.id, name: x.subject },
                                project: x.project,
                            },
                            tabIndex: 1 })}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: 32 }}>
                        <Button value="Cancel" onClick={props.onClose} />
                    </div>
                </TabPanel>
                <TabPanel>
                    <TimesheetEntryForm
                        data={!isIssueSelected ? undefined : getEntry(selectedIssue as SelectedIssue)}
                        activities={props.enumerations.activity}
                        onClose={onClose}
                        onSubmit={props.onCreate}
                    />
                </TabPanel>
            </Tabs>
        </Modal>
    );
};