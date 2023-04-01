import React from 'react';
import PropTypes from 'prop-types';
import TemplateTable from './TemplateTable';
import {fetchTemplates} from "../common/api";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            templates: []
        };
    }

    componentDidMount() {
        fetchTemplates().then(
            (result) => {
                this.setState({
                    templates: result.templates,
                    isLoaded: true
                });
            },
            (error) => {
                console.log('failed to load templates');
                this.setState({
                    error: error
                });
            }
        );
    }

    render() {
        const {error, isLoaded, templates} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <TemplateTable templates={templates}/>
                </div>
            );
        }
    }
}

export default App