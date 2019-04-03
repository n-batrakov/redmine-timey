import * as React from 'react';
import ReactPaginate from 'react-paginate';
import './pagination.css';

export type PaginationProps = {
    count: number,
    pageSize: number,
    currentPage?: number,
    onSelect?: (page: number) => void,
};
export const Pagination = (props: PaginationProps) => (
    <div style={{display: 'flex'}}>
    <ReactPaginate
        containerClassName="timey-pagination"
        pageCount={Math.ceil(props.count / props.pageSize)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={3}
        initialPage={props.currentPage}
        onPageChange={
            props.onSelect === undefined
                ? undefined
                : ({ selected }) => (props.onSelect as any)(selected)
        }
    />
    </div>
)