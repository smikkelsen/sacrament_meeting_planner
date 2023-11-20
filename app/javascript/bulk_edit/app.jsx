import React from 'react';
import PropTypes from 'prop-types';
import {fetchCurrentUser, fetchUsers, bulkEditProgram} from "../common/api";
import {Button, Col, FloatingLabel, Form, Row, Alert} from "react-bootstrap";
import {hasRole} from "../common/roles";
import _ from "lodash";
import {findArrayElementByAttribute} from "../common/utils";


class App extends React.Component {

    constructor(props) {
        super(props);
        this.renderForm = this.renderForm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.handleNestedObjChange = this.handleNestedObjChange.bind(this);
        this.clearAlert = this.clearAlert.bind(this);
        this.state = {
            error: null,
            isLoaded: false,
            currentUser: null,
            program: {},
            startDate: '',
            endDate: '',
            successMessage: null,
            errorMessage: null,
            users: []
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

    submitForm(e) {
        const {program} = this.state;
        let params = {
            start_date: this.state.startDate,
            end_date: this.state.endDate
        }
        if(program.conducting) {
            params['conducting_id'] = program.conducting.id
        }
        if(program.prep) {
            params['prep_id'] = program.prep.id
        }
        if(program.chorister) {
            params['chorister_id'] = program.chorister.id
        }
        if(program.organist) {
            params['organist_id'] = program.organist.id
        }

        bulkEditProgram(params).then(
            (result) => {
                if(result.status == 200) {
                    this.setState({successMessage: result.message});
                } else {
                    this.setState({errorMessage: result.message});
                }
            },
            (error) => {
                console.log('failed to edit forms');
                this.setState({
                    error: error
                });
            }
        );
    return('')
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state.program, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    handleInputChange(e) {
        this.setState({[e.target.id]: e.target.value})
    }

    handleNestedObjChange(array, nestedKey, e) {
        let obj = findArrayElementByAttribute(array, e.target.value, 'id');
        if (obj === undefined) {
            obj = {...this.state.program[nestedKey]}
            Object.keys(obj).forEach(function (index) {
                obj[index] = null
            });
        }
        this.setState(prevState => {
            return {program: {...prevState.program, [nestedKey]: obj}}
        })
    }

    renderUserSelect(label, userType, userTypeFilter, role) {
        let attributeId = `${userType}.id`
        return (
            <FloatingLabel label={label} controlId={attributeId}>
                <Form.Select value={this.renderInputValue(attributeId)}
                             onChange={(e) => this.handleNestedObjChange(this.state.users, userType, e)}
                             disabled={!hasRole(role, this.state.currentUser.role)}>
                    <option></option>
                    {this.state.users.filter(function (u) {
                        return u[userTypeFilter] === true
                    }).map(user => (
                        <option key={user.id} value={user.id}>{user.full_name}</option>
                    ))}
                </Form.Select>
            </FloatingLabel>
        )
    }

    renderForm() {
            return (
                <Form>
                    <Row className={'input-row'}>
                        <Col md={6} sm={12}>
                            <FloatingLabel label={'Start Date'} controlId={'startDate'}>
                                <Form.Control
                                    type="date"
                                    name="datepic"
                                    placeholder="DateRange"
                                    value={this.state.startDate}
                                    onChange={(e) => this.handleInputChange(e)}
                                />
                            </FloatingLabel>
                        </Col>
                        <Col md={6} sm={12}>
                            <FloatingLabel label={'End Date'} controlId={'endDate'}>
                                <Form.Control
                                    type="date"
                                    name="datepic"
                                    placeholder="DateRange"
                                    value={this.state.endDate}
                                    onChange={(e) => this.handleInputChange(e)}
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row className={'input-row'}>
                        <Col md={6} sm={12}>
                            {this.renderUserSelect('Sacrament Meeting Prep', 'prep', 'prepper', 'bishopric')}
                        </Col>
                        <Col md={6} sm={12}>
                            {this.renderUserSelect('Conducting', 'conducting', 'conductor', 'clerk')}
                        </Col>

                    </Row>
                    <Row className={'input-row'}>
                        <Col md={6} sm={12}>
                            {this.renderUserSelect('Organist', 'organist', 'organist', 'music')}
                        </Col>
                        <Col md={6} sm={12}>
                            {this.renderUserSelect('Chorister', 'chorister', 'chorister', 'music')}
                        </Col>
                    </Row>
                    <Button variant={"success"} onClick={(e) => this.submitForm(e)}>Submit</Button>
                </Form>
            )

    }

    clearAlert() {
        this.setState({errorMessage: null, successMessage: null})
    }
    renderAlert() {
        if (this.state.errorMessage || this.state.successMessage) {
            return (
                <Alert variant={this.state.errorMessage ? "danger" : "success"}
                       onClose={() => this.clearAlert()} dismissible>

                    <p>
                        {this.state.errorMessage ? this.state.errorMessage : this.state.successMessage}
                    </p>
                </Alert>
            );
        }
    }
    render() {
        console.log(this.state)
        const {error, isLoaded} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading... </div>;
        } else {
            return (
                <div>
                    <h4>Bulk Edit</h4>
                    <p>Select a start and end date, and choose one or more attributes to update.
                        All programs that fall on or between the start and end dates will be updated.</p>
                    {this.renderAlert()}
                    {this.renderForm()}
                </div>
            );
        }
    }
}

export default App