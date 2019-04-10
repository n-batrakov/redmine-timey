import { ActivityHeatmapProps } from '../../components/activityHeatmap';
import { HoursGaugeProps } from '../../components/hoursGauge';
import { TimesheetEntry } from '../../shared/types';
import { EditTimingModalProps, CreateTimingModalProps } from '../../components/editTimingModal';

export type TimingsPageState = {
    activityList: ActivityListState,
    heatmap: ActivityHeatmapProps,
    gauge: HoursGaugeProps,
};

export type ActivityListState = {
    data: TimesheetEntry[],
    isLoading: boolean,
    title: string,
    start: Date,
    end: Date,
    editModal?: EditTimingModalProps,
    createModal?: CreateTimingModalProps,
};