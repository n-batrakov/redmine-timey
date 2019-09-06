import * as React from 'react';
import { HoursGauge } from '../components/hoursGauge';
import { useAppState, useActions } from 'state';
import { loadHoursGaugeData } from '../state/hoursGauge/actions';
import { toISODate } from 'shared/date';

export type HoursGaugeContainerProps = {
    date?: Date,
};

export const HoursGaugeContaier = (props: HoursGaugeContainerProps) => {
    const state = useAppState(x => x.hoursGauge.data);
    const loadData = useActions(loadHoursGaugeData);

    const date = props.date || new Date();
    const month = { year: date.getFullYear(), month: date.getMonth() };

    React.useEffect(() => { loadData(month); }, [toISODate(date)]);

    return (
        <HoursGauge
            actualValue={state.actualValue}
            expectedValue={state.expectedValue}
        />
    );
};