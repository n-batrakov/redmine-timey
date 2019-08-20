import './index.css';
import * as React from 'react';
import { Enumeration, TimesheetEntry, NamedId } from '../../shared/types';
import { Form, FormRow } from '../form';
import { DateInput, Select, SelectOption, NumberInput, TextArea } from '../input';
import { toArray } from '../../shared';
import { Button } from '../button';

const onSubmit = (props: TimingFormProps) => React.useCallback(
    (e: { spentOn: Date | string, hours: string, comments: string, activity: string }) => {
        if (props.onSubmit === undefined) {
            return;
        }

        const entry: Partial<TimesheetEntry> = {
            ...props.data,
            hours: parseFloat(e.hours),
            comments: e.comments,
            spentOn: typeof e.spentOn === 'string' ? new Date(Date.parse(e.spentOn)) : e.spentOn,
            activity: { id: e.activity },
        };

        props.onSubmit(entry);
    },
    [props.onSubmit, props.data],
);

const onDelete = (props: TimingFormProps) => React.useCallback(
    () => {
        if (props.onDelete === undefined) {
            return;
        }
        if (props.data === undefined || props.data.id === undefined) {
            console.error('Invalid entry. Required properties are missing', props.data);
            return;
        }

        props.onDelete(props.data.id);
    },
    [props.onDelete, props.data],
);


export type TimingFormProps = {
    loading?: boolean,
    data?: Partial<TimesheetEntry>,
    activities: Enumeration,
    showDelete?: boolean,
    onSubmit?: (form: Partial<TimesheetEntry>) => void,
    onDelete?: (id: string) => void,
    onClose?: () => void,
    style?: React.CSSProperties,
};

export const TimingForm = (props: TimingFormProps) => {
    const { spentOn, comments, hours, activity } = entryOrDefault(props.data);

    return (
        <Form onSubmit={onSubmit(props)} loading={props.loading} style={props.style}>
            <FormRow>
                <label htmlFor="spentOn">Date</label>
                <DateInput required name="spentOn" value={spentOn}  />
            </FormRow>
            <FormRow>
                <label htmlFor="hours">Hours</label>
                <NumberInput required name="hours" value={hours} step={0.25} min={0} max={24} />
            </FormRow>
            <FormRow>
                <label htmlFor="comments">Comments</label>
                <TextArea required name="comments" value={comments} placeholder="" style={{ height: 100 }}/>
            </FormRow>
            <FormRow>
                <label htmlFor="activity">Activity</label>
                <Select required name="activity" value={activity.id}>
                    {toArray(props.activities).map(x => (<SelectOption key={x.id} value={x.id}>{x.name}</SelectOption>))}
                </Select>
            </FormRow>
            <FormRow floatRight inline>
                {
                    props.showDelete
                        ? <Button
                            value="Delete"
                            type="danger"
                            style={{ marginRight: 'auto', marginLeft: 0 }}
                            onClick={onDelete(props)} />
                        : null
                }
                <Button value="Cancel" onClick={props.onClose}/>
                <Button value="Save" type="primary" submit />
            </FormRow>
        </Form>
    );
};


const nullNamedId = { id: '0', name: '' };
function entryOrDefault(entry: Partial<TimesheetEntry> | undefined) {
    const x = entry || {};

    return {
        id: x.id || '0',
        spentOn: x.spentOn || new Date(),
        comments: x.comments || '',
        hours: x.hours || NaN,
        activity: x.activity || nullNamedId,
        project: x.project || nullNamedId,
        user: x.user || nullNamedId,
    };
}
