import * as React from 'react';
import { SvgIcon, IconProps } from './svgIcon';

export const IconArrowRight = (props: IconProps) => (
    <SvgIcon {...props} viewBox="0 0 1024 1024">
        <path fill="currentColor" d="M256 1024c-6.552 0-13.102-2.499-18.101-7.499-9.998-9.997-9.998-26.206 0-36.203l442.698-442.698-442.698-442.699c-9.998-9.997-9.998-26.206 0-36.203s26.206-9.998 36.203 0l460.8 460.8c9.998 9.997 9.998 26.206 0 36.203l-460.8 460.8c-5 5-11.55 7.499-18.102 7.499z" />
    </SvgIcon>
);

export const IconArrowLeft = (props: IconProps) => (
    <SvgIcon {...props} viewBox="0 0 1024 1024">
        <path fill="currentColor" d="M716.8 1024c6.552 0 13.102-2.499 18.101-7.499 9.998-9.997 9.998-26.206 0-36.203l-442.698-442.698 442.698-442.699c9.998-9.997 9.998-26.206 0-36.203s-26.206-9.998-36.203 0l-460.8 460.8c-9.998 9.997-9.998 26.206 0 36.203l460.8 460.8c5 5 11.55 7.499 18.102 7.499z" />
    </SvgIcon>
);