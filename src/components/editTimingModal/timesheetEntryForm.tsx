import * as React from 'react';

import { TimesheetEntry } from '../../shared/types';

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

export type TimesheetEntryFormProps = {
    onClose?: () => void,
    onSubmit?: (form: TimesheetEntry, disableLoadingState: () => void) => void,
    onDelete?: (id: string, disableLoadingState: () => void) => void,
    showDelete?: boolean,
    data: TimesheetEntry,
};

export class TimesheetEntryForm extends React.Component<TimesheetEntryFormProps, { isLoading: boolean }> {
    constructor(props: TimesheetEntryFormProps) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onFinishLoading = this.onFinishLoading.bind(this);

        this.state = { isLoading: false };
    }

    private onFinishLoading() {
        this.setState({ isLoading: false });
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

        this.setState({ isLoading: true });

        this.props.onSubmit(entry, this.onFinishLoading);
    }

    private onDelete() {
        if (this.props.onDelete === undefined) {
            return;
        }

        this.setState({ isLoading: true });

        this.props.onDelete(this.props.data.id, this.onFinishLoading);
    }

    public render() {
        const { spentOn, comments, hours, activity } = this.props.data;
        const issue = this.props.data.issue || { id: '0', name: '---' };

        return (
            <Form onSubmit={this.onSubmit} loading={this.state.isLoading}>
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
                    {
                        this.props.showDelete
                            ? <Button value="Delete" type="danger" style={{ marginRight: 'auto' }} onClick={this.onDelete}/>
                            : undefined
                    }
                </FormFooter>
            </Form>
        );
    }
}