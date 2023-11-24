import React from 'react';
import PropTypes from 'prop-types';
import UserRows from './UserRows';
import {fetchUsers, fetchCurrentUser, fetchUserRoles} from "../common/api";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            error: null,
            isLoaded: false,
            users: [],
            roles: []
        };
    }


    componentDidMount() {
        fetchUsers().then(
            (result) => {
                this.setState({
                    users: result.users
                });
                fetchCurrentUser().then(
                    (result) => {
                        this.setState({
                            isLoaded: true,
                            currentUser: result
                        });
                        fetchUserRoles().then(
                            (result) => {
                                this.setState({
                                    isLoaded: true,
                                    roles: result
                                });
                            },
                            (error) => {
                                console.log('failed to load roles');
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
    }

    render() {
        const {error, isLoaded, users, roles, currentUser} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <UserRows users={users} roles={roles} currentUser={currentUser}/>
            );
        }
    }
}

export default App