import React from 'react';
import PropTypes from 'prop-types';
import BulletinItems from './BulletinItems';
import {fetchBulletinItems, fetchBulletinItemTypes, fetchCurrentUser} from "../common/api";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            error: null,
            isLoaded: false,
            bulletin_items: [] ,
            bulletin_item_types: []
        };
    }


    componentDidMount() {
        fetchCurrentUser().then(
            (result) => {
                this.setState({
                    currentUser: result
                });
                fetchBulletinItems().then(
                    (result) => {
                        this.setState({
                            bulletin_items: result.bulletin_items
                        });
                        fetchBulletinItemTypes().then(
                            (result) => {
                                this.setState({
                                    isLoaded: true,
                                    bulletin_item_types: result.item_types
                                });
                            },
                            (error) => {
                                console.log('failed to load bulletinItem Types');
                                this.setState({
                                    isLoaded: true,
                                    error: error
                                });
                            }
                        )
                    },
                    (error) => {
                        console.log('failed to load bulletinItems');
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
    }

    render() {
        const {error, isLoaded, currentUser, bulletin_items, bulletin_item_types} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <BulletinItems bulletin_items={bulletin_items} currentUser={currentUser} bulletinItemTypes={bulletin_item_types} />
            );
        }
    }
}

export default App