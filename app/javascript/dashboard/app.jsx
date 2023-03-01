import React from 'react';
import PropTypes from 'prop-types';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
        };
    }



    componentDidMount() {
        this.setState({
            isLoaded: true
        });
    }

    render() {
        const {error, isLoaded, tasks} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                </div>
            );
        }
    }
}

export default App