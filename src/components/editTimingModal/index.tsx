import * as React from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './editTimingModal.css';

import { TimesheetEntryForm, TimesheetEntryFormProps } from './timesheetEntryForm';
import { IssueSelectionForm } from './issueSelectionForm';
import { NamedId, TimesheetEntry, Issue } from '../../shared/types';

const onModalClose = () => false;

const ModalHeader = ({ title }: { title: string }) => (
    <h2 style={{
        margin: '15px 32px 0',
    }}>{title}</h2>
);


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
            <ModalHeader title="Edit Timing" />
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
    const [{ tabIndex, selectedIssue }, setState] = React.useState({
        tabIndex: 0,
        selectedIssue: (undefined as Issue | undefined),
    });

    const onClose = () => {
        setState({ tabIndex: 0, selectedIssue: undefined });
        if (props.onClose !== undefined) {
            props.onClose();
        }
    };

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

    return (
        <Modal
            isOpen={props.opened || false}
            onRequestClose={onModalClose}
            className="edit-timing-modal"
        >
            <ModalHeader title="Add Timing" />
            <Tabs selectedIndex={tabIndex} onSelect={idx => setState({ selectedIssue, tabIndex: idx })}>
                <TabList>
                    <Tab>Issue</Tab>
                    <Tab disabled={selectedIssue === undefined}>Timing</Tab>
                </TabList>
                <TabPanel>
                    <IssueSelectionForm
                        onClose={onClose}
                        onIssueSelected={selectedIssue => setState({ selectedIssue, tabIndex: 1 })}
                    />
                </TabPanel>
                <TabPanel>
                    <TimesheetEntryForm
                        data={selectedIssue === undefined ? undefined : getEntry(selectedIssue)}
                        onClose={onClose}
                        onSubmit={props.onCreate}
                    />
                </TabPanel>
            </Tabs>
        </Modal>
    );
};