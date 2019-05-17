import * as React from 'react';

export type AnimatedClockProps = {
    date: Date,
    style?: React.CSSProperties,
};

export const AnimatedClock = (props: AnimatedClockProps) => {
    const date = props.date;

    const seconds = date.getSeconds();
    const secondsAngle = 360 * (seconds / 60);

    const minutes = date.getMinutes();
    const minutesValue = (minutes * 60) + seconds;
    const minutesAngle = 360 * (minutesValue / 3600);

    const hours = date.getHours();
    const hoursValue = ((hours > 12 ? hours - 12 : hours) * 3600) + minutesValue;
    const hoursAngle = 360 * (hoursValue / 43200);

    return (
        <svg
            version="1.1"
            className="timey-clock"
            x="0px" y="0px"
            viewBox="0 0 384 384"
            enableBackground="new 0 0 384 384"
            style={props.style}
        >
            <circle cx="192" cy="192" r="192" fill="#464c54"/>
            <circle cx="192" cy="192" r="172" fill="#fff"/>

            <line
                id="timey-clock-hour-hand"
                fill="none"
                stroke="#76bffd"
                strokeWidth="20"
                strokeMiterlimit="10"
                transform={`rotate(${hoursAngle}, 192, 192)`}
                x1="192" y1="192" x2="192" y2="100" />
            <line
                id="timey-clock-minute-hand"
                fill="none"
                stroke="#76bffd"
                strokeWidth="20"
                strokeMiterlimit="10"
                transform={`rotate(${minutesAngle}, 192, 192)`}
                x1="192" y1="192" x2="192" y2="60"/>
            <line
                id="timey-clock-second-hand"
                fill="none"
                stroke="#D53A1F"
                strokeWidth="4"
                strokeMiterlimit="10"
                transform={`rotate(${secondsAngle}, 192, 192)`}
                x1="192" y1="192" x2="192" y2="28.5" />

            <circle cx="192" cy="192" r="34" fill="#76bffd"/>
            <circle cx="192" cy="192" r="14" fill="#fff"/>

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
                    dur="43200s"
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
                    dur="3600s"
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
                    dur="60s"
                    to="360 192 192"
                    from="0 192 192"
                    attributeName="transform"
                    attributeType="xml">
                </animateTransform>
            </defs>
        </svg>
    );
};