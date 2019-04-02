import * as React from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './editTimingModal.css';

import { TimesheetEntryForm, TimesheetEntryFormProps } from './timesheetEntryForm';
import { IssueSelectionForm } from './issueSelectionForm';
import { NamedId, TimesheetEntry, Issue } from '../../shared/types';

const onModalClose = () => false;


export type EditTimingModalProps = {
    opened?: boolean,
    data: TimesheetEntry,
    onUpdate?: (entry: TimesheetEntry, finish: () => void) => void,
    onDelete?: (entryId: string, finish: () => void) => void,
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
    opened?: boolean,
    onCreate?: (entry: TimesheetEntry, finish: () => void) => void,
    onClose?: () => void,
};
export const CreateTimingModal = (props: CreateTimingModalProps) => {
    const [selectedIssue, setSelectedIssue] = React.useState((undefined as Issue | undefined));

    const getEntry = (issue: Issue) => ({
        id: '',
        comments: '',
        hours: 0,
        spentOn: new Date(),
        activity: { id: '' },
        project: issue.project,
        issue: { id: issue.id, name: issue.subject },
        user: { id: '' },
    }) as TimesheetEntry;

    const isIssueSelected = selectedIssue !== undefined;

    return (
        <Modal
            isOpen={props.opened || false}
            onRequestClose={onModalClose}
            className="edit-timing-modal"
        >
            <Tabs defaultIndex={isIssueSelected ? 0 : 1}>
                <TabList>
                    <Tab>Issue</Tab>
                    <Tab disabled={!isIssueSelected}>Timing</Tab>
                </TabList>
                <TabPanel>
                    <IssueSelectionForm
                        onClose={props.onClose}
                        onIssueSelected={x => setSelectedIssue(x)}
                    />
                </TabPanel>
                <TabPanel>
                    <TimesheetEntryForm
                        data={getEntry(selectedIssue as any)}
                        onClose={props.onClose}
                        onSubmit={props.onCreate}
                    />
                </TabPanel>
            </Tabs>
        </Modal>
    );
};