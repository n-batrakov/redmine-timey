import './index.scss';
import * as React from 'react';

export type AnimatedClockProps = {
    date: Date,
    loading?: boolean,
    style?: React.CSSProperties,
};

export const AnimatedClock = (props: AnimatedClockProps) => {
    const date = props.date;

    const seconds = date.getSeconds();
    const secondsAngle = 360 * (seconds / 60);
    const secondsDuration = props.loading ? '0.5s' : '60s';

    const minutes = date.getMinutes();
    const minutesValue = (minutes * 60) + seconds;
    const minutesAngle = 360 * (minutesValue / 3600);
    const minuteDuration = props.loading ? '1s' : '3600s';

    const hours = date.getHours();
    const hoursValue = ((hours > 12 ? hours - 12 : hours) * 3600) + minutesValue;
    const hoursAngle = 360 * (hoursValue / 43200);
    const hoursDuration = props.loading ? '1.5s' : '43200s';

    return (
        <svg
            version="1.1"
            className="timey-clock"
            x="0px" y="0px"
            viewBox="0 0 384 384"
            enableBackground="new 0 0 384 384"
            style={props.style}
        >
            <circle className="color-line" cx="192" cy="192" r="175" />
            <circle className="color-bkg" cx="192" cy="192" r="172" />

            <line
                id="timey-clock-hour-hand"
                className="color-line"
                strokeWidth="3"
                strokeMiterlimit="10"
                transform={`rotate(${hoursAngle}, 192, 192)`}
                x1="192" y1="192" x2="192" y2="100" />
            <line
                id="timey-clock-minute-hand"
                className="color-line"
                strokeWidth="3"
                strokeMiterlimit="10"
                transform={`rotate(${minutesAngle}, 192, 192)`}
                x1="192" y1="192" x2="192" y2="60"/>
            <line
                id="timey-clock-second-hand"
                stroke="#D53A1F"
                strokeWidth="3"
                strokeMiterlimit="10"
                transform={`rotate(${secondsAngle}, 192, 192)`}
                x1="192" y1="192" x2="192" y2="28.5" />

            <circle className="color-line" cx="192" cy="192" r="17" fill="#2261a1"/>
            <circle className="color-bkg" cx="192" cy="192" r="14" fill="#fff"/>

            <defs>
                <animateTransform
                    type="rotate"
                    fill="remove"
                    restart="always"
                    calcMode="linear"
                    accumulate="none"
                    additive="sum"
                    xlinkHref="#timey-clock-hour-hand"
                    repeatCount="indefinite"
                    dur={hoursDuration}
                    to="360 192 192"
                    from="0 192 192"
                    attributeName="transform"
                    attributeType="xml">
                </animateTransform>
                <animateTransform
                    type="rotate"
                    fill="remove"
                    restart="always"
                    calcMode="linear"
                    accumulate="none"
                    additive="sum"
                    xlinkHref="#timey-clock-minute-hand"
                    repeatCount="indefinite"
                    dur={minuteDuration}
                    to="360 192 192"
                    from="0 192 192"
                    attributeName="transform"
                    attributeType="xml">
                </animateTransform>
                <animateTransform
                    type="rotate"
                    fill="remove"
                    restart="always"
                    calcMode="linear"
                    accumulate="none"
                    additive="sum"
                    xlinkHref="#timey-clock-second-hand"
                    repeatCount="indefinite"
                    dur={secondsDuration}
                    to="360 192 192"
                    from="0 192 192"
                    attributeName="transform"
                    attributeType="xml">
                </animateTransform>
            </defs>
        </svg>
    );
};