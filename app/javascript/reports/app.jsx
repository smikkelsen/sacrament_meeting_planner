import React from 'react';
import PropTypes from 'prop-types';
import HymnReport from './HymnReport';
import MeetingPrepReport from './MeetingPrepReport';
import ProgramSummaryReport from './ProgramSummaryReport';
import {hasRole} from '../common/roles.js';
import {Row, Col, FloatingLabel, Form} from "react-bootstrap";
import _ from "lodash";
import {fetchCurrentUser, fetchHymns} from "../common/api";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.renderReport = this.renderReport.bind(this);
        this.state = {
            currentUser: null,
            error: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        fetchCurrentUser().then(
            (result) => {
                this.setState({
                    currentUser: result,
                    isLoaded: true
                });
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

    handleInputChange(e) {
        this.setState({[e.target.id]: e.target.value})
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    renderReport() {
        switch (this.state.reportType) {
            case 'meeting-prep':
                return (<MeetingPrepReport></MeetingPrepReport>)
                break;
            case 'program-summary':
                return (<ProgramSummaryReport></ProgramSummaryReport>)
                break;
            case 'hymn':
                return (<HymnReport></HymnReport>)
                break;
            case '':
                return (<div></div>)
                break;
        }
    }

    renderReportType() {
        let reportTypeOptions = [
            {key: 1, value: '', label: 'Choose Report'}
        ]
        if (hasRole('music', this.state.currentUser.role)) {
            reportTypeOptions.push({key: 2, value: 'hymn', label: 'Music'})
        }
        if (hasRole('bishopric', this.state.currentUser.role)) {
            reportTypeOptions.push({key: 3, value: 'meeting-prep', label: 'Meeting Prep'})
        }
        if (hasRole('bishopric', this.state.currentUser.role)) {
            reportTypeOptions.push({key: 4, value: 'program-summary', label: 'Program Summary'})
        }
        return (
            <Col sm={12}>
                <FloatingLabel label={'Report Type'} controlId={'reportType'}>
                    <Form.Select
                        value={this.renderInputValue('reportType')}
                        onChange={(e) => this.handleInputChange(e)}>
                        {reportTypeOptions.map(option => (
                            <option key={option.key} value={option.value}>{option.label}</option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
            </Col>
        )
    }

    render() {
        const {error, isLoaded} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <Row>
                        {this.renderReportType()}
                    </Row>
                    <Row>
                        {this.renderReport()}
                    </Row>
                </div>
            );
        }
    }
}

export default App