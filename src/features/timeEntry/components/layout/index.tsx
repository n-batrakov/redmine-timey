import './index.scss';
import * as React from 'react';
import { MobileScreen, MobileScreenHidden } from 'components/mediaQuery';
import { Tabs, TabList, TabPanel, Tab } from 'components/tabs';
import { ToggledIssueFilter, OverflowIssueFilter } from '../issueFilter';

type PageLayoutProps = {
    title?: React.ReactNode,
    filter?: React.ReactNode,
    issues?: React.ReactNode,
    form?: React.ReactNode,

    issueSelected?: boolean,
    unselectIssue: () => void,
    onRefresh?: () => void,
};

const MobileLayout = (props: PageLayoutProps) => (
    <main className="timing-page mobile">
        <h1>{props.title}</h1>
        <Tabs selectedIndex={props.issueSelected ? 1 : 0} onSelect={props.unselectIssue}>
            <TabList>
                <Tab>Issue</Tab>
                <Tab disabled={props.issueSelected !== true}>Details</Tab>
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

const DesktopLayout = (props: PageLayoutProps) => (
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
