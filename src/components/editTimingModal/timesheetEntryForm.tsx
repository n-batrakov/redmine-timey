import * as React from 'react';

import { TimesheetEntry, Enumeration} from '../../shared/types';
import { toArray } from '../../shared';

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
    activities: Enumeration,
    onClose?: () => void,
    onSubmit?: (form: TimesheetEntry, disableLoadingState: () => void) => void,
    onDelete?: (id: string, disableLoadingState: () => void) => void,
    showDelete?: boolean,
    data?: TimesheetEntry,
    title?: string,
};

const nullNamedId = { id: '0', name: '' };
const defaultFormDate: TimesheetEntry = {
    id: '0',
    spentOn: new Date(),
    comments: '',
    hours: 0,
    activity: nullNamedId,
    issue: nullNamedId,
    project: nullNamedId,
    user: nullNamedId,
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

        if (this.props.data === undefined) {
            alert('Unable to save data. Form is not valid.');
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

        if (this.props.data === undefined) {
            alert('Unable to delete data. Form is not valid.');
            return;
        }

        this.setState({ isLoading: true });

        this.props.onDelete(this.props.data.id, this.onFinishLoading);
    }

    public render() {
        const { spentOn, comments, hours, activity, issue: originalIssue } = this.props.data || defaultFormDate;
        const issue = originalIssue || nullNamedId;

        return (
            <Form onSubmit={this.onSubmit} loading={this.state.isLoading}>
                {this.props.title === undefined ? undefined : <FormHeader>{this.props.title}</FormHeader>}

                <DateInput label="Date" name="spentOn" value={spentOn}  />
                <Select label="Issue" name="issue" value={issue.id} disabled>
                    <SelectOption value={issue.id}>{issue.name}</SelectOption>
                </Select>
                <NumberInput label="Hours" name="hours" value={hours} step={0.25} min={0} max={24} />
                <TextArea label="Comments" name="comments" value={comments} placeholder="" style={{ height: 100 }}/>
                <Select label="Activity" name="activity" value={activity.id}>
                    {toArray(this.props.activities).map(x => (<SelectOption key={x.id} value={x.id}>{x.name}</SelectOption>))}
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