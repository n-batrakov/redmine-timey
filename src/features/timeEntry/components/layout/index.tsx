import './index.scss';
import * as React from 'react';
import { MobileScreen, MobileScreenHidden } from 'components/mediaQuery';
import { Tabs, TabList, TabPanel, Tab } from 'components/tabs';
import { ToggledIssueFilter, OverflowIssueFilter } from '../issueFilter';

export type LayoutView = 'form' | 'issues';

type PageLayoutProps = {
    title?: React.ReactNode,
    filter?: React.ReactNode,
    issues?: React.ReactNode,
    form?: React.ReactNode,

    view?: 'form' | 'issues',
    onViewChange: (view: LayoutView) => void,
    formDisabled?: boolean,

    onRefresh?: () => void,
};

const MobileLayout = (props: PageLayoutProps) => {
    const idx = props.view === 'form' ? 1 : 0;
    const onSelect = React.useCallback(
        (x: number) => props.onViewChange(x === 0 ? 'issues' : 'form'),
        [props.onViewChange],
    );

    return (
        <main className="timing-page mobile">
            <h1>{props.title}</h1>
            <Tabs selectedIndex={idx} onSelect={x => onSelect(x)}>
                <TabList>
                    <Tab>Issue</Tab>
                    <Tab disabled={props.formDisabled}>Details</Tab>
                </TabList>
                <TabPanel>
                    <h3>Select an Issue</h3>
                    <ToggledIssueFilter>{props.filter}</ToggledIssueFilter>
                    {props.issues}
                </TabPanel>
                <TabPanel>
                    {props.form}
                </TabPanel>
            </Tabs>
        </main>
    );
};

const DesktopLayout = (props: PageLayoutProps) => {
    return (
        <main className="timing-page desktop">
            <OverflowIssueFilter opened={false} onRefresh={props.onRefresh}>
                {props.filter}
            </OverflowIssueFilter>
            <div className="col">
                <h1>{props.title}</h1>
                <div className="row">
                    <div className="issues-container">
                        <h3>Select an Issue</h3>
                        {props.issues}
                    </div>
                    <div className="entry-container">{props.form}</div>
                </div>
            </div>
        </main>
    );
};

export const PageLayout = (props: PageLayoutProps) => (
    <>
        <MobileScreen>
            <MobileLayout {...props} />
        </MobileScreen>
        <MobileScreenHidden>
            <DesktopLayout {...props} />
        </MobileScreenHidden>
    </>
);
