import * as React from 'react';
import { IssueList } from '../../components/issueList';
import { CoverLoader } from '../../components/preloader';
import { Pagination } from '../../components/pagination';
import { Issue } from '../../shared/types';
import { connect } from 'react-redux';
import { AppState } from '../../state';
import { loadData } from './actions';
import { IssueControlPanel, IssueControlPanelProps } from '../../components/issueControlPanel';


const projects = new Array(10).fill(undefined).map((_, i) => ({ value: i.toString(), label: `Project #${i}` }));
const statuses = ['New', 'In progress', 'Solved', 'Closed', 'Discarded'].map((x, i) => ({ value: i.toString(), label: x }));
const users = new Array(100).fill(undefined).map((_, i) => ({ value: i.toString(), label: `User ${i}` }));
const queries = new Array(10).fill(undefined).map((_, i) => ({ value: i.toString(), label: `Query ${i}` }));
const controlPanelProps: IssueControlPanelProps = {
    users,
    queries,
    projects,
    statuses,
};


export type IssuesProps = {
    isLoading: boolean,
    totalCount: number,
    page: number,
    pageSize: number,
    loadData: (page: number) => void,
    data: Issue[],

    onSelect?: (issue: Issue) => void,
};

const Component = (props: IssuesProps) => {
    React.useEffect(() => props.loadData(0), []);

    return (
        <div>
            <CoverLoader active={props.isLoading}/>
            <IssueControlPanel
                {...controlPanelProps}
                onApplyFilters={(data) => {
                    console.log(data);
                }}
            />
            <IssueList
                onSelect={props.onSelect}
                data={props.data}
            />
            <Pagination
                count={props.totalCount}
                currentPage={props.page}
                pageSize={props.pageSize}
                onSelect={props.loadData}
            />
        </div>
    );
};

export const Issues = connect(
    (state: AppState, props: Partial<IssuesProps>): Partial<IssuesProps> => ({
        ...props,
        ...state.issues,
    }),
    {
        loadData,
    },
)(Component);