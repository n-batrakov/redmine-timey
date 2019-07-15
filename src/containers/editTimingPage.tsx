import * as React from 'react';
import { PageContent } from '../components/pageContent';
import { RouteComponentProps } from 'react-router';

export type EditTimingPageProps = RouteComponentProps<{id: string}> & {

};
export const EditTimingPage = (props: EditTimingPageProps) => {
    const id = props.match.params.id;

    return (
        <PageContent>
            <h1>Edit timing</h1>
        </PageContent>
    );
};

export const CreateTimingPage = (props: EditTimingPageProps) => {
    return (
        <PageContent>
            <h1>Create timing</h1>
        </PageContent>
    );
};