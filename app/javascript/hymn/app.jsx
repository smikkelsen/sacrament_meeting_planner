import React from 'react';
import PropTypes from 'prop-types';
import HymnTable from './HymnTable';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            hymns: []
        };
    }

    fetchHymns() {
        fetch("/api/v1/hymns")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        hymns: result.hymns
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidMount() {
        this.fetchHymns();
    }

    render() {
        const {error, isLoaded, hymns} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <HymnTable hymns={hymns}/>
                </div>
            );
        }
    }
}

export default App