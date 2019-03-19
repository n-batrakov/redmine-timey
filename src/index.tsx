import * as React from 'react';
import { render } from 'react-dom';

type AppState = {
    isLoaded: boolean,
    isError: boolean,
    data: any,
};

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {isLoaded: false, isError: false, data: undefined};

        this.onBtnClick = this.onBtnClick.bind(this);
    }

    componentDidMount() {
        fetch('/api/time').then(async (x) => {
            if (x.status !== 200) {
                this.setState({ isError: true, isLoaded: true });
                return;
            }

            const data = await x.json();
            this.setState({ data, isLoaded: true });
        });
    }

    private onBtnClick() {
        fetch('/api/logout', { method: 'POST' }).then((x) => {
            if (x.status === 401) {
                this.setState({ isLoaded: true, isError: false, data: 'Logged out' });
            } else {
                alert('Something went wrong');
            }
        });
    }

    public render() {
        if (!this.state.isLoaded) {
            return <p>Stand by...</p>;
        }

        if (this.state.isError) {
            return <p>Something went wrong</p>;
        }

        return (
            <>
                <button onClick={this.onBtnClick}>Logout</button>
                <p>{JSON.stringify(this.state.data, null, 2)}</p>
            </>
        );
    }
}

render(<App />, document.getElementById('app'));