import MediaQuery from 'react-responsive';
import * as React from 'react';

export const MobileScreen = ({ children }: { children: React.ReactNode }) =>
    <MediaQuery query="(max-width: 767px)">{children}</MediaQuery>;

export const MobileScreenHidden = ({ children }: { children: React.ReactNode }) =>
    <MediaQuery query="(min-width: 768px)">{children}</MediaQuery>;