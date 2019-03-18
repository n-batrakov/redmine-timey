import * as React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
    public render() {
        return <h1>Hello</h1>;
    }
}

render(<App />, document.getElementById('app'));