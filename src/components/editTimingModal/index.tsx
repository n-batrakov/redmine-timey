import * as React from 'react';
import Modal from 'react-modal';
import { TimesheetEntry } from '../../shared/types';
import './editTimingModal.css';
import {
    Form,
    FormHeader,
    FormFooter,
    TextArea,
    Select,
    Button,
    SelectOption,
    DateInput,
    NumberInput,
} from '../form';

export type EditTimingModalProps = {
    isOpened: boolean,
    onClose: () => void,
    onSubmit?: (form: TimesheetEntry) => void,
    onDelete?: (id: string) => void,
    data: TimesheetEntry,
};

export class EditTimingModal extends React.Component<EditTimingModalProps> {
    constructor(props: EditTimingModalProps) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    private onSubmit(e: { spentOn: Date | string, issue: string, hours: string, comments: string, activity: string }) {
        if (this.props.onSubmit === undefined) {
            return;
        }

        const entry: TimesheetEntry = {
            ...this.props.data,
            spentOn: typeof e.spentOn === 'string' ? new Date(Date.parse(e.spentOn)) : e.spentOn,
            hours: parseFloat(e.hours),
            comments: e.comments,
            activity: { id: e.activity },
        };

        this.props.onSubmit(entry);
    }

    private onDelete() {
        if (this.props.onDelete === undefined) {
            return;
        }

        this.props.onDelete(this.props.data.id);
    }

    public render() {
        const { spentOn, comments, hours, activity } = this.props.data;
        const issue = this.props.data.issue || { id: '0', name: '---' };

        return (
            <Modal
                isOpen={this.props.isOpened}
                onRequestClose={this.props.onClose}
                contentLabel="Edit timing"
                className="edit-timing-modal"
            >
                <Form onSubmit={this.onSubmit}>
                    <FormHeader>Edit Timing</FormHeader>

                    <DateInput label="Date" name="spentOn" value={spentOn}  />
                    <Select label="Issue" name="issue" value={issue.id} disabled>
                        <SelectOption value={issue.id}>{issue.name}</SelectOption>
                    </Select>
                    <NumberInput label="Hours" name="hours" value={hours} step={0.25} min={0} max={24} />
                    <TextArea label="Comments" name="comments" value={comments} placeholder="" style={{ height: 100 }}/>
                    <Select label="Activity" name="activity" value={activity.id}>
                        <SelectOption value={activity.id}>{activity.name}</SelectOption>
                    </Select>
                    <FormFooter>
                        <Button value="Save" type="submit"/>
                        <Button value="Cancel" onClick={this.props.onClose}/>
                        <Button value="Delete" type="danger" style={{ float: 'left' }} onClick={this.onDelete}/>
                    </FormFooter>
                </Form>
            </Modal>
        );
    }
}