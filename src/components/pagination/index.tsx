import * as React from 'react';
import ReactPaginate from 'react-paginate';
import './pagination.css';

export type PaginationProps = {
    count: number,
    pageSize: number,
    currentPage?: number,
    onSelect?: (page: number) => void,
    style?: React.CSSProperties,
};

function getScreenSize(width: number): 'xs' | 's' | 'm' | 'l' | 'xl' {
    if (width < 540) {
        return 'xs';
    } else if (width < 720) {
        return 's';
    } else if (width < 960) {
        return 'm';
    } else if (width < 1140) {
        return 'l';
    } else {
        return 'xl';
    }
}

const getPaginationRange = () => {
    const size = getScreenSize(document.body.clientWidth);

    switch (size) {
        case 'xs':
            return { range: 0, margin: 0 };
        case 's':
            return { range: 1, margin: 0 };
        default:
            return { range: 3, margin: 3 };
    }
};

export const Pagination = (props: PaginationProps) => {
    const { range, margin } = getPaginationRange();
    const pageCount = Math.ceil(props.count / props.pageSize);


    return (
        <div style={{ display: pageCount === 0 ? 'none' : 'flex', ...props.style }}>
            <ReactPaginate
                containerClassName="timey-pagination"
                pageCount={pageCount}
                pageRangeDisplayed={range}
                marginPagesDisplayed={margin}
                previousLabel="<"
                nextLabel=">"
                initialPage={props.currentPage}
                onPageChange={
                    props.onSelect === undefined
                        ? undefined
                        : ({ selected }) => (props.onSelect as any)(selected)
                }
            />
        </div>
    );
};