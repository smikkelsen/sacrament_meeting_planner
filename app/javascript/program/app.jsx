import React from 'react';
import PropTypes from 'prop-types';
import ProgramRows from './ProgramRows';
import {fetchPrograms, fetchUsers, fetchHymns, fetchCurrentUser} from "../common/api";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            error: null,
            isLoaded: false,
            hymns: [],
            programs: [],
            users: []
        };
    }


    componentDidMount() {
        fetchPrograms().then(
            (result) => {
                this.setState({
                    programs: result.programs
                });
                fetchUsers().then(
                    (result) => {
                        this.setState({
                            users: result.users
                        });
                        fetchCurrentUser().then(
                            (result) => {
                                this.setState({
                                    currentUser: result
                                });
                                fetchHymns().then(
                                    (result) => {
                                        this.setState({
                                            isLoaded: true,
                                            hymns: result.hymns
                                        });
                                    },
                                    (error) => {
                                        console.log('failed to load hymns');
                                        this.setState({
                                            isLoaded: true,
                                            error: error
                                        });
                                    }
                                )
                            },
                            (error) => {
                                console.log('failed to load currentUser');
                                this.setState({
                                    isLoaded: true,
                                    error: error
                                });
                            }
                        )
                    },
                    (error) => {
                        console.log('failed to load users');
                        this.setState({
                            error: error
                        });
                    }
                );
            },
            (error) => {
                console.log('failed to load programs');
                this.setState({
                    error: error
                });
            }
        );
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