import * as React from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './editTimingModal.css';

import { TimesheetEntryForm, TimesheetEntryFormProps } from './timesheetEntryForm';

export type EditTimingModalProps = TimesheetEntryFormProps & {
    isOpened: boolean,
};

export class EditTimingModal extends React.Component<EditTimingModalProps, { isLoading: boolean }> {
    constructor(props: EditTimingModalProps) {
        super(props);

        this.onClose = this.onClose.bind(this);

        this.state = { isLoading: false };
    }

    private onClose() {
        return false;
    }

    public render() {
        return (
            <Modal
                isOpen={this.props.isOpened}
                onRequestClose={this.onClose}
                contentLabel="Edit timing"
                className="edit-timing-modal"
            >
                <Tabs defaultIndex={1}>
                    <TabList>
                        <Tab>Issue</Tab>
                        <Tab>Timing</Tab>
                    </TabList>
                    <TabPanel>
                        <h2>Select an Issue</h2>
                    </TabPanel>
                    <TabPanel>
                        <TimesheetEntryForm {...this.props} />
                    </TabPanel>
                </Tabs>
            </Modal>
        );
    }
}