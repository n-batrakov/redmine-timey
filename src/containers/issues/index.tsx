import * as React from 'react';
import { IssueList } from '../../components/issueList';
import { CoverLoader } from '../../components/preloader';
import { Pagination } from '../../components/pagination';
import { Issue, Enumeration } from '../../shared/types';
import { connect } from 'react-redux';
import { AppState } from '../../state';
import { loadData, gotoPage, applyFilter } from './actions';
import { IssueControlPanel } from '../../components/issueControlPanel';
import { RouteComponentProps } from 'react-router';
import { IssueFilterValue, IssuesFilter, IssueFilterField } from './types';


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
} & RouteComponentProps;

const mapEnumerationToSelect = (x: Enumeration): Array<{ value: string, label: string}> => {
    return Object.entries(x.values).map(([value, label]) => ({ value, label }));
};

const Component = (props: IssuesProps) => {
    React.useEffect(() => props.loadData(), []);

    return (
        <div>
            <CoverLoader active={props.isLoading}/>
            <IssueControlPanel
                projects={props.projects}
                statuses={props.statuses}
                queries={props.queries}
                users={props.users}
                formValue={props.filter}
                onApplyFilters={props.applyFilter}
                onDropFilters={props.applyFilter}
                style={{ maxWidth: 1480 }}
                compact
            />
            <NoData visible={!props.isLoading && props.data.length === 0} />
            <IssueList
                onSelect={props.onSelect}
                data={props.data}
            />
            <Pagination
                count={props.totalCount}
                currentPage={props.page}
                pageSize={props.pageSize}
                onSelect={props.gotoPage}
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