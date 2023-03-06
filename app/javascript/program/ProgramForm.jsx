import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {findArrayElementByAttribute} from '../common/utils.js';
import {isMeetingType} from './programHelpers.js';
import {FloatingLabel} from "react-bootstrap";
import ProgramItemForm from './ProgramItemForm';

const _ = require('lodash');

// import {formatDateString, csrfToken} from '../common/utils.js';
const USER_ROLES = {
    admin: ['admin'],
    bishopric: ['bishopric', 'bishop', 'admin'],
    clerk: ['clerk', 'bishopric', 'bishop', 'admin'],
    music: ['music', 'clerk', 'bishopric', 'bishop', 'admin']
}

class ProgramForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNestedObjChange = this.handleNestedObjChange.bind(this);
        this.hasRole = this.hasRole.bind(this);
        this.handleProgramItemsUpdate = this.handleProgramItemsUpdate.bind(this);
        this.renderUserSelect = this.renderUserSelect.bind(this);
        this.renderHymnSelect = this.renderHymnSelect.bind(this);
        this.state = {
            program: this.props.program,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.program !== this.state.program) {
            this.props.handleToUpdate(this.state.program)
        }
    }

    renderUserSelect(label, userType, userTypeFilter, role) {
        let attributeId = `${userType}.id`
        return (
            <FloatingLabel label={label} controlId={attributeId}>
                <Form.Select value={this.renderInputValue(attributeId)}
                             onChange={(e) => this.handleNestedObjChange(this.props.users, userType, e)}
                             disabled={!this.hasRole(role)}>
                    <option></option>
                    {this.props.users.filter(function (u) {
                        return u[userTypeFilter] === true
                    }).map(user => (
                        <option key={user.id} value={user.id}>{user.full_name}</option>
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
                    onChange={(e) => this.handleNestedObjChange(this.props.hymns, hymnType, e)}
                    disabled={!this.hasRole(role)}>
                    <option></option>
                    {this.props.hymns.map(hymn => (
                        <option key={hymn.id} value={hymn.id}>#{hymn.page} {hymn.name}</option>
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

    handleInputChange(e) {
        this.setState(prevState => {
            return {program: {...prevState.program, [e.target.id]: e.target.value}}
        }, this.props.handleToDirty(true))
    }

    hasRole(role) {
        return (
            USER_ROLES[role].includes(this.props.currentUser.role)
        )
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
                <FloatingLabel className={'input-row'} label={'Meeting Type'} controlId={'meeting_type'}>
                    <Form.Select
                        value={this.renderInputValue('meeting_type')}
                        onChange={(e) => this.handleInputChange(e)}
                        disabled={!this.hasRole('clerk')}>
                        <option value={'standard'}>Standard</option>
                        <option value={'fast_sunday'}>Fast Sunday</option>
                        <option value={'ward_conference'}>Ward Conference</option>
                        <option value={'stake_conference'}>Stake Conference</option>
                        <option value={'general_conference'}>General Conference</option>
                    </Form.Select>
                </FloatingLabel>
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
                                        disabled={!this.hasRole('clerk')}/>
                                </FloatingLabel>
                            </Col>
                            <Col md={6} sm={12}>
                                <FloatingLabel className={'input-row'} label={'Closing Prayer'}
                                               controlId={'closing_prayer'}>
                                    <Form.Control
                                        value={this.renderInputValue('closing_prayer')}
                                        onChange={(e) => this.handleInputChange(e)}
                                        disabled={!this.hasRole('clerk')}/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <hr/>
                        {isMeetingType(this.state.program.meeting_type, ['fast_sunday']) ? '' :
                            <>
                                <h4>Program</h4>
                                <ProgramItemForm
                                    programId={this.state.program.id}
                                    programItems={this.state.program.program_items}
                                    itemTypes={['speaker', 'musical_number', 'program_other']}
                                    addType={'program_new'}
                                    currentUser={this.props.currentUser}
                                    handleToUpdate={this.handleProgramItemsUpdate.bind(this)}
                                />
                                <hr/>
                            </>
                        }
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
                    </>
                }
                <hr/>
                <Form.Group sm={12} controlId={'notes'}>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" rows={3}
                                  value={this.renderInputValue('notes')}
                                  onChange={(e) => this.handleInputChange(e)}
                                  disabled={!this.hasRole('bishopric')}
                    />
                </Form.Group>
            </Form>
        )
    }
}

export default ProgramForm
