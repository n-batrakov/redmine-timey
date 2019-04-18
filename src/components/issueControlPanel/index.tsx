import * as React from 'react';

import { Form } from '../form';
import { Grid, Row, Col, ColProps, RowProps } from '../layout';
import Select from 'react-select';
import { Button } from '../button';
import { Styles } from 'react-select/lib/styles';
import { MobileScreen, MobileScreenHidden } from '../mediaQuery';


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
const statusSelectStyles: Partial<Styles> = ({
    option: styles => ({ ...styles, textAlign: 'left' }),
});
const btnStyle: React.CSSProperties = {
    height: 27,
    lineHeight: 0,
    marginLeft: 8,
};

type FilterFormProps = IssueControlPanelProps & {
    hideCancelButton: boolean,
    onCancelClick?: () => void,
    style?: React.CSSProperties,
};
const FilterForm = (props: FilterFormProps) => (
    <Form onSubmit={props.onApplyFilters as any} style={props.style}>
        <Grid style={{ maxWidth: 1480, padding: 0 }}>
            <PanelRow>
                <PanelCol>
                    <Select name="query" options={props.queries} placeholder="Query" styles={selectStyles} />
                </PanelCol>
                <PanelCol>
                    <Select name="project" options={props.projects} placeholder="Project" styles={selectStyles} />
                </PanelCol>
                <PanelCol>
                    <Select name="author" options={props.users} placeholder="Author" styles={selectStyles} />
                </PanelCol>
                <PanelCol>
                    <Select name="assigned" options={props.users} placeholder="Assigned"  styles={selectStyles} />
                </PanelCol>
            </PanelRow>
            <PanelRow end="xs">
                <PanelCol md={8} lg={6} >
                    <Select
                        isMulti
                        name="statuses"
                        options={props.statuses}
                        placeholder="Status"
                        closeMenuOnSelect={false}
                        styles={{ ...selectStyles, ...statusSelectStyles }}
                    />
                </PanelCol>
                <PanelCol>
                    <MobileScreen>
                        <Button
                            value="Cancel"
                            style={{ ...btnStyle, display: props.hideCancelButton ? 'none' : undefined }}
                            onClick={props.onCancelClick}
                        />
                    </MobileScreen>
                    <Button submit value="Apply" style={btnStyle} />
                </PanelCol>
            </PanelRow>
        </Grid>
    </Form>
);

type FilterFormData = {
    author: string,
    assigned: string,
    project: string,
    query: string,
    statuses: Array<string>,
};
type SelectOptionValue = { value: string, label: string };
export type IssueControlPanelProps = {
    users: Array<SelectOptionValue>,
    projects: Array<SelectOptionValue>,
    queries: Array<SelectOptionValue>,
    statuses: Array<SelectOptionValue>,
    onApplyFilters?: (data: FilterFormData) => void,
};
export const IssueControlPanel = (props: IssueControlPanelProps) => {
    const [hidden, toggleHidden] = React.useState(true);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <MobileScreen>
                <Button
                    value="Filters"
                    onClick={() => toggleHidden(false)}
                    style={{ ...btnStyle, margin: 0, display: hidden ? undefined : 'none' }}
                />
                <FilterForm
                    {...props}
                    hideCancelButton={hidden}
                    onCancelClick={() => toggleHidden(true)}
                    style={{ display: hidden ? 'none' : undefined }}
                />
            </MobileScreen>
            <MobileScreenHidden>
                <FilterForm {...props} hideCancelButton={true}/>
            </MobileScreenHidden>
        </div>
    );
}