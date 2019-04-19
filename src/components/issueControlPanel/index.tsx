import * as React from 'react';

import { Form } from '../form';
import { Grid, Row, Col, ColProps, RowProps } from '../layout';
import Select from 'react-select';
import { Button } from '../button';
import { Styles } from 'react-select/lib/styles';


const PanelRow = ({ children, ...props }: RowProps) => (
    <Row {...props}>
        {children}
    </Row>
);
const PanelCol = ({ children, ...props }: ColProps) => (
    <Col xs={12} md style={{ marginBottom: 4, marginTop: 4 }} {...props}>
        {children}
    </Col>
);

const selectStyles: Partial<Styles> = ({
    control: styles => ({ ...styles, minHeight: 0 }),
    dropdownIndicator: styles => ({ ...styles, padding: '0 8px' }),
    clearIndicator: styles => ({ ...styles, padding: '0 8px' }),
    valueContainer: styles => ({ ...styles, padding: '0 8px' }),
});

const btnStyle: React.CSSProperties = {
    height: 27,
    lineHeight: 0,
    marginLeft: 8,
};

type FilterFormProps = IssueControlPanelProps & {
    hideCancelButton: boolean,
    onCancelClick?: () => void,
    onDropClick?: () => void,
    style?: React.CSSProperties,
};

const defaultFormValue: IncomingFilterFormData = {
    author: undefined,
    assigned: undefined,
    project: undefined,
    query: undefined,
    status: undefined,
};

const FilterForm = (props: FilterFormProps) => {
    const value = props.formValue || defaultFormValue;
    return (
        <Form onSubmit={props.onApplyFilters as any} style={props.style}>
            <Grid style={{ padding: 0 }}>
                <PanelRow>
                    <PanelCol>
                        <Select
                            name="query"
                            placeholder="Query"
                            options={props.queries}
                            styles={selectStyles}
                            isClearable
                            defaultValue={value.query}
                        />
                    </PanelCol>
                    <PanelCol>
                        <Select
                            name="project"
                            placeholder="Project"
                            options={props.projects}
                            styles={selectStyles}
                            isClearable
                            defaultValue={value.project}
                        />
                    </PanelCol>
                    <PanelCol>
                        <Select
                            name="author"
                            placeholder="Author"
                            options={props.users}
                            styles={selectStyles}
                            isClearable
                            defaultValue={value.author}
                        />
                    </PanelCol>
                    <PanelCol>
                        <Select
                            name="assigned"
                            placeholder="Assigned"
                            options={props.users}
                            styles={selectStyles}
                            isClearable
                            defaultValue={value.assigned}
                        />
                    </PanelCol>
                    <PanelCol>
                        <Select
                            name="status"
                            placeholder="Status"
                            options={props.statuses}
                            styles={selectStyles}
                            isClearable
                            defaultValue={value.status}
                        />
                    </PanelCol>
                </PanelRow>
                <PanelRow end="xs">
                    <PanelCol>
                        <Button
                            value="Cancel"
                            style={{ ...btnStyle, display: props.hideCancelButton ? 'none' : undefined }}
                            onClick={props.onCancelClick}
                        />
                        {/* <Button value="Drop" style={btnStyle} onClick={props.onDropClick}/> */}
                        <Button submit value="Apply" style={btnStyle} />
                    </PanelCol>
                </PanelRow>
            </Grid>
        </Form>
    );
}


export type SelectOptionValue = { value: string, label: string };

export type IncomingFilterFormData = {
    author?: SelectOptionValue,
    assigned?: SelectOptionValue,
    project?: SelectOptionValue,
    query?: SelectOptionValue,
    status?: SelectOptionValue,
};

export type OutgoingFilterFormData = {
    author?: string,
    assigned?: string,
    project?: string,
    query?: string,
    status?: string,
};

export type IssueControlPanelProps = {
    users: Array<SelectOptionValue>,
    projects: Array<SelectOptionValue>,
    queries: Array<SelectOptionValue>,
    statuses: Array<SelectOptionValue>,
    formValue?: IncomingFilterFormData,
    compact?: boolean,
    onApplyFilters?: (data: OutgoingFilterFormData) => void,
    onDropFilters?: () => void,
    style?: React.CSSProperties,
};

export const IssueControlPanel = (props: IssueControlPanelProps) => {
    const [hidden, toggleHidden] = React.useState(true);
    const isCompact = props.compact || false;

    return (
        <div style={{ ...props.style, display: 'flex', flexDirection: 'column' }}>
            <Button
                value="Filters"
                onClick={() => toggleHidden(false)}
                style={{
                    ...btnStyle,
                    margin: 0,
                    display: isCompact ? hidden ? undefined : 'none' : 'none',
                }}
            />
            <FilterForm
                {...props}
                hideCancelButton={!isCompact}
                onCancelClick={() => toggleHidden(true)}
                onDropClick={props.onDropFilters}
                style={{ display: !hidden || !isCompact ? undefined : 'none' }}
            />
        </div>
    );
}