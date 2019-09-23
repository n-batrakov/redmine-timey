import MediaQuery from 'react-responsive';
import * as React from 'react';

export const MobileScreen = ({ children }: { children: React.ReactNode }) =>
    <MediaQuery query="(max-width: 991.98px)">{children}</MediaQuery>;

export const MobileScreenHidden = ({ children }: { children: React.ReactNode }) =>
    <MediaQuery query="(min-width: 992px)">{children}</MediaQuery>;