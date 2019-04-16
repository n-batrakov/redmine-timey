import * as React from 'react';
import { IssueList } from '../../components/issueList';
import { Preloader } from '../../components/preloader';
import { Pagination } from '../../components/pagination';
import { Issue } from '../../shared/types';
import { connect } from 'react-redux';
import { AppState } from '../../state';
import { loadData } from './actions';

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
        <>
            <Preloader active={props.isLoading}/>
            <IssueList
                onSelect={props.onSelect}
                data={props.data}/>
            <Pagination
                count={props.totalCount}
                currentPage={props.page}
                pageSize={props.pageSize}
                onSelect={props.loadData}
            />
        </>
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