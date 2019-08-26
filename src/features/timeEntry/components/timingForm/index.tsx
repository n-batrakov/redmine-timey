import * as React from 'react';
import { Enumeration, TimesheetEntry } from '../../../../shared/types';
import { Form, FormRow } from '../../../../components/form';
import { toArray } from '../../../../shared';
import { Button } from '../../../../components/button';
import { toISODate } from '../../../../shared/date';

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
    disabled?: boolean,
    submitLabel?: string,
    onSubmit?: (form: Partial<TimesheetEntry>) => void,
    onDelete?: (id: string) => void,
    onClose?: () => void,
    style?: React.CSSProperties,
};

export const TimingForm = (props: TimingFormProps) => {
    const { spentOn, comments, hours, activity } = entryOrDefault(props.data);

    const onDeleteClick = onDelete(props);

    return (
        <Form onSubmit={onSubmit(props)} loading={props.loading} style={props.style}>
            <FormRow>
                <label htmlFor="spentOn">Date</label>
                <input type="date" required name="spentOn" defaultValue={toISODate(spentOn)}  />
            </FormRow>
            <FormRow>
                <label htmlFor="hours">Hours</label>
                <input type="number" required name="hours" defaultValue={hours.toString(10)} step={0.25} min={0} max={24} />
            </FormRow>
            <FormRow>
                <label htmlFor="comments">Comments</label>
                <textarea required name="comments" defaultValue={comments} placeholder="" style={{ height: 100 }}/>
            </FormRow>
            <FormRow>
                <label htmlFor="activity">Activity</label>
                <select required name="activity" defaultValue={activity.id}>
                    {toArray(props.activities).map(x => (<option key={x.id} value={x.id}>{x.name}</option>))}
                </select>
            </FormRow>
            <FormRow floatRight inline>
                {
                    props.showDelete
                        ? <Button
                            label="Delete"
                            kind="danger"
                            style={{ marginRight: 'auto', marginLeft: 0 }}
                            onClick={onDeleteClick} />
                        : null
                }
                <Button label="Cancel" onClick={props.onClose}/>
                <Button label={props.submitLabel || 'Save'} kind="primary" type="submit" disabled={props.disabled} />
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
        hours: x.hours === undefined ? NaN : x.hours,
        activity: x.activity || nullNamedId,
        project: x.project || nullNamedId,
        user: x.user || nullNamedId,
    };
}
