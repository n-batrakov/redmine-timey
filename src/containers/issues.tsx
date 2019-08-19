import * as React from 'react';
import { IssueList } from '../components/issueList';
import { CoverLoader } from '../components/preloader';
import { Issue, Enumeration } from '../shared/types';
import { connect } from 'react-redux';
import { loadData, gotoPage, applyFilter } from '../store/issues/actions';
import { RouteComponentProps } from 'react-router';
import { IssueFilterValue, IssuesFilter, IssueFilterField } from '../store/issues/types';
import { AppState } from '../store';


const NoData = React.memo((props: { visible: boolean }) => {
    return (
        <div style={{ display: props.visible ? undefined : 'none' }}>
            <h2>No data</h2>
            <p>Please, specify different search criteria.</p>
        </div>
    );
});

export type IssuesProps = {
    isLoading: boolean,
    totalCount: number,
    page: number,
    pageSize: number,
    data: Issue[],
    projects: IssueFilterField[],
    statuses: IssueFilterField[],
    queries: IssueFilterField[],
    users: IssueFilterField[],
    filter?: IssuesFilter,

    loadData: () => void,
    gotoPage: (page: number) => void,
    applyFilter: (filter?: IssueFilterValue) => void,

    onSelect?: (issue: Issue) => void,
    style?: React.CSSProperties,
} & RouteComponentProps;

const mapEnumerationToSelect = (x: Enumeration): Array<{ value: string, label: string}> => {
    return Object.entries(x.values).map(([value, label]) => ({ value, label }));
};

const Component = (props: IssuesProps) => {
    if (props.data === undefined || props.data.length === 0) {
        React.useEffect(() => { props.loadData(); }, []);
    }

    return (
        <div style={props.style}>
            <CoverLoader active={props.isLoading}/>
            <NoData visible={!props.isLoading && props.data.length === 0} />
            <IssueList
                onSelect={props.onSelect}
                data={props.data}
            />
        </div>
    );
};

export const Issues = connect(
    (state: AppState, props: Partial<IssuesProps>): Partial<IssuesProps> => ({
        ...props,
        ...state.issues,
        projects: mapEnumerationToSelect(state.enumerations.projects),
        statuses: mapEnumerationToSelect(state.enumerations.status),
        users: mapEnumerationToSelect(state.enumerations.users),
        queries: mapEnumerationToSelect(state.enumerations.queries),
    }),
    {
        loadData,
        gotoPage,
        applyFilter,
    },
)(Component);