import './index.css';
import * as React from 'react';
import { Enumeration, TimesheetEntry } from '../../shared/types';
import { Form, FormFooter } from '../form';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Label, DateInput, Select, SelectOption, NumberInput, TextArea } from '../input';
import { toArray } from '../../shared';
import { Button } from '../button';


const FormRow = (props: { children: React.ReactNode }) => (
    <Row style={{
        margin: '8px 0',
    }}>
        <Col xs={12}>
            {props.children}
        </Col>
    </Row>
);

const nullNamedId = { id: '0', name: '' };

const getFormData = (entry: Partial<TimesheetEntry> | undefined) => {
    const x = entry || {};

    return {
        id: x.id || '0',
        spentOn: x.spentOn || new Date(),
        comments: x.comments || '',
        hours: x.hours || NaN,
        activity: x.activity || nullNamedId,
        issue: x.issue || nullNamedId,
        project: x.project || nullNamedId,
        user: x.user || nullNamedId,
    };
};

const onSubmit = (props: TimingFormProps) => React.useCallback(
    (e: { spentOn: Date | string, issue: string, hours: string, comments: string, activity: string }) => {
        if (props.onSubmit === undefined) {
            return;
        }

        if (
            props.data === undefined ||
            props.data.id === undefined ||
            props.data.issue === undefined ||
            props.data.project === undefined ||
            props.data.user === undefined
        ) {
            alert('Unable to save data. Form is not valid.');
            return;
        }

        const { id, issue, project, user } = props.data;

        const entry: TimesheetEntry = {
            id, issue, project, user,
            spentOn: typeof e.spentOn === 'string' ? new Date(Date.parse(e.spentOn)) : e.spentOn,
            hours: parseFloat(e.hours),
            comments: e.comments,
            activity: { id: e.activity },
        };

        props.onSubmit(entry);
    },
    [props.onSubmit],
);

const onDelete = (props: TimingFormProps) => React.useCallback(
    () => {
        if (props.onDelete === undefined) {
            return;
        }
        if (props.data === undefined || props.data.id === undefined) {
            alert('Unable to delete data. Form is not valid.');
            return;
        }

        props.onDelete(props.data.id);
    },
    [props.onDelete],
);

export type TimingFormProps = {
    loading?: boolean,
    data?: Partial<TimesheetEntry>,
    activities: Enumeration,
    showDelete?: boolean,
    onSubmit?: (form: TimesheetEntry) => void,
    onDelete?: (id: string) => void,
    onClose?: () => void,
    style?: React.CSSProperties,
};

export const TimingForm = (props: TimingFormProps) => {
    const { spentOn, comments, hours, activity, issue } = getFormData(props.data);

    return (
        <Form onSubmit={onSubmit(props)} loading={props.loading} style={props.style}>
            <Grid fluid>
                <FormRow>
                    <Label label="Date">
                        <DateInput required name="spentOn" value={spentOn}  />
                    </Label>
                </FormRow>
                <FormRow>
                    <Label label="Issue">
                        <Select name="issue" value={issue.id}>
                            <SelectOption value={issue.id}>{issue.name}</SelectOption>
                        </Select>
                    </Label>
                </FormRow>
                <FormRow>
                    <Label label="Hours">
                        <NumberInput required name="hours" value={hours} step={0.25} min={0} max={24} />
                    </Label>
                </FormRow>
                <FormRow>
                    <Label label="Comments">
                        <TextArea required name="comments" value={comments} placeholder="" style={{ height: 100 }}/>
                    </Label>
                </FormRow>
                <FormRow>
                    <Label label="Activity">
                        <Select required name="activity" value={activity.id}>
                            {toArray(props.activities).map(x => (<SelectOption key={x.id} value={x.id}>{x.name}</SelectOption>))}
                        </Select>
                    </Label>
                </FormRow>
                <FormRow>
                    <FormFooter>
                        <Button value="Save" type="primary" submit />
                        <Button value="Cancel" onClick={props.onClose}/>
                        {
                            props.showDelete
                                ? <Button
                                    value="Delete"
                                    type="danger"
                                    style={{ marginRight: 'auto' }}
                                    onClick={onDelete(props)} />
                                : undefined
                        }
                    </FormFooter>
                </FormRow>
            </Grid>
        </Form>
    );
};