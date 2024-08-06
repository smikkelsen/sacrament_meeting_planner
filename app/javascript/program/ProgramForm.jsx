import React from 'react';
import {Form, Row, Col, Alert} from "react-bootstrap";
import {findArrayElementByAttribute, humanize} from '../common/utils.js';
import {formatDateTimeString, parseDateFromString} from '../common/date.js';
import {hasRole} from '../common/roles.js';
import {isMeetingType} from './programHelpers.js';
import {FloatingLabel} from "react-bootstrap";
import ProgramItemForm from './ProgramItemForm';
import {fetchLastUsedHymnProgram} from "../common/api";

const _ = require('lodash');

class ProgramForm extends React.Component {

    constructor(props) {
        super(props);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNestedObjChange = this.handleNestedObjChange.bind(this);
        this.handleProgramItemsUpdate = this.handleProgramItemsUpdate.bind(this);
        this.renderUserSelect = this.renderUserSelect.bind(this);
        this.renderHymnSelect = this.renderHymnSelect.bind(this);
        this.renderHymnLastUsed = this.renderHymnLastUsed.bind(this);
        this.state = {
            program: this.props.program,
            lastUsedHymnMessaage: null
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.program !== this.state.program) {
            this.props.handleToUpdate(this.state.program)
        }
    }

    renderUserSelect(label, userType, userTypeFilter, role) {
        let attributeId = `${userType}.id`
        let users = this.props.users
        if(userTypeFilter) {
            users = users.filter(function (u) {
                return u[userTypeFilter] === true
            })
        }
        if(parseDateFromString(this.state.program.date) >= new Date() ) {
            users = users.filter(function (u) {
                return u['workflow_state'] === 'active'
            })
        }
        
        return (
            <FloatingLabel label={label} controlId={attributeId}>
                <Form.Select value={this.renderInputValue(attributeId)}
                             onChange={(e) => this.handleNestedObjChange(this.props.users, userType, e)}
                             disabled={!hasRole(role, this.props.currentUser.role)}>
                    <option></option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.full_name}
                            {user.workflow_state !== "active" && ` (${user.workflow_state})`}
                        </option>
                    ))}
                </Form.Select>
            </FloatingLabel>
        )
    }

    renderHymnSelect(label, hymnType, role) {
        let attributeId = `${hymnType}.id`
        return (
            <FloatingLabel label={label} controlId={attributeId}>
                <Form.Select
                    id={attributeId}
                    value={this.renderInputValue(attributeId)}
                    onChange={(e) => this.handleHymnChange(this.props.hymns, hymnType, e)}
                    disabled={!hasRole(role, this.props.currentUser.role)}>
                    <option></option>
                    {this.props.hymns.map(hymn => (
                        <option key={hymn.id} value={hymn.id}>{humanize(hymn.category)} - #{hymn.page} {hymn.name}</option>
                    ))}
                </Form.Select>
            </FloatingLabel>
        )
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
        }, this.props.handleToDirty(true))
    }

    handleHymnChange(array, nestedKey, e) {
        var hymnId = e.target.value;
        if(hymnId) {
            fetchLastUsedHymnProgram(hymnId).then(
                (result) => {
                    var message = 'this ' + humanize(nestedKey)
                    if (result.programs.length > 0 && result.programs[0].id != hymnId) {
                        message = message + ' was last used on ' + formatDateTimeString(result.programs[0].date, 'MMM do yyyy')
                    } else {
                        message = message + ' has never been used'
                    }
                    this.setState({lastUsedHymnMessaage: message})
                },
                (error) => {
                    console.log('failed to find recent usages of this hymn');
                    this.setState({
                        error: error
                    });
                }
            );
        }
        this.handleNestedObjChange(array, nestedKey, e)
    }

    renderHymnLastUsed() {
        if (this.state.lastUsedHymnMessaage) {
            return (
                <Alert variant={'info'}>
                    {this.state.lastUsedHymnMessaage}
                </Alert>
            )
        } else {
            return ('')
        }
    }

    handleInputChange(e) {
        this.setState(prevState => {
            return {program: {...prevState.program, [e.target.id]: e.target.value}}
        }, this.props.handleToDirty(true))
    }

    handleProgramItemsUpdate(programItems) {
        this.setState(prevState => {
            return {program: {...prevState.program, program_items: programItems}}
        }, this.props.handleToDirty(true))
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state.program, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    render() {
        return (
            <Form>
                <Row className={'input-row'}>
                    <Col md={6} sm={12}>
                <FloatingLabel className={'input-row'} label={'Meeting Type'} controlId={'meeting_type'}>
                    <Form.Select
                        value={this.renderInputValue('meeting_type')}
                        onChange={(e) => this.handleInputChange(e)}
                        disabled={!hasRole('clerk', this.props.currentUser.role)}>
                        <option value={'standard'}>Standard</option>
                        <option value={'fast_sunday'}>Fast Sunday</option>
                        <option value={'ward_conference'}>Ward Conference</option>
                        <option value={'stake_conference'}>Stake Conference</option>
                        <option value={'general_conference'}>General Conference</option>
                    </Form.Select>
                </FloatingLabel>
                    </Col>
                    <Col md={6} sm={12}>
                        {this.renderUserSelect('Presiding', 'presiding', null, 'bishopric')}
                    </Col>
                </Row>
                {isMeetingType(this.state.program.meeting_type, ['stake_conference', 'general_conference']) ? '' :
                    <>
                        <Row className={'input-row'}>
                            <Col md={6} sm={12}>
                                {this.renderUserSelect('Sacrament Meeting Prep', 'prep', 'prepper', 'bishopric')}
                            </Col>
                            <Col md={6} sm={12}>
                                {this.renderUserSelect('Conducting', 'conducting', 'conductor', 'clerk')}
                            </Col>

                        </Row>
                        <hr/>
                        {isMeetingType(this.state.program.meeting_type, ['stake_conference', 'general_conference']) ? '' :
                            <>
                                <Row className={'input-row'}>
                                    <Col md={6} sm={12}>
                                        {this.renderUserSelect('Organist', 'organist', 'organist', 'music')}
                                    </Col>
                                    <Col md={6} sm={12}>
                                        {this.renderUserSelect('Chorister', 'chorister', 'chorister', 'music')}
                                    </Col>
                                </Row>
                                <Row className={'input-row'}>
                                    <Col md={6} sm={12}>
                                        {this.renderHymnSelect('Opening Hymn', 'opening_hymn', 'music')}
                                    </Col>
                                    <Col md={6} sm={12}>
                                        {this.renderHymnSelect('Sacrament Hymn', 'sacrament_hymn', 'music')}
                                    </Col>
                                </Row>
                                <Row className={'input-row'}>
                                    <Col md={6} sm={12}>
                                        {this.renderHymnSelect('Intermediate Hymn', 'intermediate_hymn', 'music')}
                                    </Col>
                                    <Col md={6} sm={12}>
                                        {this.renderHymnSelect('Closing Hymn', 'closing_hymn', 'music')}
                                    </Col>
                                </Row>
                                {this.renderHymnLastUsed()}
                                <hr/>
                            </>
                        }
                        <Row className={'input-row'}>
                            <Col md={6} sm={12}>
                                <FloatingLabel className={'input-row'} label={'Opening Prayer'}
                                               controlId={'opening_prayer'}>
                                    <Form.Control
                                        value={this.renderInputValue('opening_prayer')}
                                        onChange={(e) => this.handleInputChange(e)}
                                        disabled={!hasRole('clerk', this.props.currentUser.role)}/>
                                </FloatingLabel>
                            </Col>
                            <Col md={6} sm={12}>
                                <FloatingLabel className={'input-row'} label={'Closing Prayer'}
                                               controlId={'closing_prayer'}>
                                    <Form.Control
                                        value={this.renderInputValue('closing_prayer')}
                                        onChange={(e) => this.handleInputChange(e)}
                                        disabled={!hasRole('clerk', this.props.currentUser.role)}/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <hr/>
                        {isMeetingType(this.state.program.meeting_type, ['fast_sunday']) || !hasRole('clerk', this.props.currentUser.role) ? '' :
                            <>
                                <h4>Program</h4>
                                <ProgramItemForm
                                    programId={this.state.program.id}
                                    intermediateHymnText={this.props.intermediateHymnText}
                                    programItems={this.state.program.program_items}
                                    itemTypes={['speaker', 'intermediate_hymn', 'musical_number', 'program_other']}
                                    addType={'program_new'}
                                    currentUser={this.props.currentUser}
                                    handleToUpdate={this.handleProgramItemsUpdate.bind(this)}
                                />
                                <hr/>
                            </>
                        }
                        {!hasRole('clerk', this.props.currentUser.role) ? '' :
                            <>
                                <h4>Announcements</h4>
                                <ProgramItemForm
                                    programId={this.state.program.id}
                                    programItems={this.state.program.program_items}
                                    itemTypes={['announcement']}
                                    addType={'announcement'}
                                    currentUser={this.props.currentUser}
                                    handleToUpdate={this.handleProgramItemsUpdate.bind(this)}
                                />
                                <hr/>
                                <h4>Releases</h4>
                                <ProgramItemForm
                                    programId={this.state.program.id}
                                    programItems={this.state.program.program_items}
                                    itemTypes={['release']}
                                    addType={'release'}
                                    currentUser={this.props.currentUser}
                                    handleToUpdate={this.handleProgramItemsUpdate.bind(this)}
                                />
                                <hr/>
                                <h4>Sustaining</h4>
                                <ProgramItemForm
                                    programId={this.state.program.id}
                                    programItems={this.state.program.program_items}
                                    itemTypes={['sustaining']}
                                    addType={'sustaining'}
                                    currentUser={this.props.currentUser}
                                    handleToUpdate={this.handleProgramItemsUpdate.bind(this)}
                                />
                                <hr/>
                                <h4>Business</h4>
                                <ProgramItemForm
                                    programId={this.state.program.id}
                                    programItems={this.state.program.program_items}
                                    itemTypes={['business']}
                                    addType={'business'}
                                    currentUser={this.props.currentUser}
                                    handleToUpdate={this.handleProgramItemsUpdate.bind(this)}
                                />
                                <hr/>
                                <Form.Group sm={12} controlId={'notes'}>
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control as="textarea" rows={3}
                                                  value={this.renderInputValue('notes')}
                                                  onChange={(e) => this.handleInputChange(e)}
                                                  disabled={!hasRole('bishopric', this.props.currentUser.role)}
                                    />
                                </Form.Group>
                            </>
                        }
                    </>
                }
            </Form>
        )
    }
}

export default ProgramForm
