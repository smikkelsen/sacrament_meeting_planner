import React from 'react';
import PropTypes from 'prop-types';
import ProgramRows from './ProgramRows';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            error: null,
            isLoaded: false,
            hymns: [],
            programs: [],
            users: []
        };
    }

    fetchPrograms() {
        fetch("/api/v1/programs")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        programs: result.programs
                    });
                    this.fetchUsers();
                },
                (error) => {
                    this.setState({
                        error: error
                    });
                }
            )
    }

    fetchUsers() {
        fetch("/api/v1/users")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        users: result.users
                    });
                    this.fetchHymns()
                },
                (error) => {
                    this.setState({
                        error: error
                    });
                }
            )
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
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
    }

    componentDidMount() {
        this.fetchPrograms();
    }

    render() {
        const {error, isLoaded, programs, users, hymns, currentUser} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ProgramRows programs={programs} users={users} hymns={hymns} currentUser={currentUser}/>
            );
        }
    }
}

export default App