import * as React from 'react';

import { IssueList } from '../issueList';
import { Issue } from '../../shared/types';
import { DataSource, Paginable } from '../../shared/dataSource';
import { Pagination } from '../pagination';
import { Preloader } from '../preloader';


const getLimitOffset = (page: number, pageSize: number): Paginable => {
    return {
        limit: pageSize,
        offset: page * pageSize,
    };
};

export type IssueSelectionFormProps = {
    dataSource: DataSource<{}, Issue>,
    onIssueSelected?: (issue: Issue) => void,
    onClose?: () => void,
};
export const IssueSelectionForm = (props: IssueSelectionFormProps) => {
    const [state, setState] = React.useState({
        pageSize: 10,
        page: 0,
        data: [] as Issue[],
        isLoading: true,
        totalCount: 0,
    });

    React.useEffect(
        () => {
            const paginable = getLimitOffset(state.page, state.pageSize);
            props.dataSource(paginable).then((response) => {
                setState({
                    ...state,
                    totalCount: response.totalCount,
                    data: response.data,
                    isLoading: false,
                });
            });
        },
        [state.page]);
    const onNextPage = (page: number) => {
        setState({
            ...state,
            page,
            data: [],
            isLoading: true,
        });
    };

    return (
        <>
            <Preloader active={state.isLoading}/>
            <IssueList
                data={state.data}
                onSelect={props.onIssueSelected}
            />
            <Pagination
                count={state.totalCount}
                currentPage={state.page}
                pageSize={state.pageSize}
                onSelect={onNextPage}
            />

            <div style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: 32 }}>
                <button
                    className="btn"
                    onClick={props.onClose}>Cancel</button>
            </div>
        </>
    );
};