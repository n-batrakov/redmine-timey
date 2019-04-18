import '../../../node_modules/react-flexbox-grid/dist/react-flexbox-grid.css';
import * as React from 'react';
import {
    Grid as BaseGrid, GridProps as BaseGridProps,
    Row as BaseRow, RowProps as BaseRowProps,
    Col as BaseCol, ColProps as BaseColProps,
} from 'react-flexbox-grid';

export const Grid = (props: GridProps) => <BaseGrid fluid {...props} />;
export type GridProps = BaseGridProps;

export const Row = BaseRow;
export type RowProps = BaseRowProps;

export const Col = BaseCol;
export type ColProps = BaseColProps;