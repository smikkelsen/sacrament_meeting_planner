import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import {formatDateString} from '../common/utils.js';
import {isMeetingType} from './programHelpers.js';
import {ChevronCompactDown, ChevronCompactUp} from 'react-bootstrap-icons';
import ProgramItems from "./ProgramItems";
import ProgramForm from "./ProgramForm";

const _ = require('lodash');

const USER_ROLES = {
    admin: ['admin'],
    bishopric: ['bishopric', 'bishop', 'admin'],
    clerk: ['clerk', 'bishopric', 'bishop', 'admin'],
    music: ['music', 'clerk', 'bishopric', 'bishop', 'admin']
}

class ProgramRow extends React.Component {

    constructor(props) {
        super(props);
        this.handleProgramFormUpdate = this.handleProgramFormUpdate.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleCollapse = this.handleCollapse.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.hasRole = this.hasRole.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.renderProgramNotes = this.renderProgramNotes.bind(this);
        this.renderMeetingType = this.renderMeetingType.bind(this);
        this.renderHymn = this.renderHymn.bind(this);
        this.renderPerson = this.renderPerson.bind(this);
        this.renderSpeakersNeeded = this.renderSpeakersNeeded.bind(this);
        this.renderMusicNeeded = this.renderMusicNeeded.bind(this);
        this.renderPrayersNeeded = this.renderPrayersNeeded.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.renderFormSubmitButton = this.renderFormSubmitButton.bind(this);

        this.state = {
            showEditModal: false,
            expanded: false,
            program: this.props.program,
            dirty: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!_.isEqual(prevState.program, this.state.program)) {
            if (!prevState.dirty && !this.state.dirty) {
                this.setState({dirty: true})
            } else {
                
            }
        }
    }

    handleEdit(_e) {
        this.setState({showEditModal: true})
    }

    handleExpand(_e) {
        if (this.state.expanded) {
            if (event.target.classList.contains('collapsable')) {
                this.setState({expanded: false})
            }
        } else {
            this.setState({expanded: true})
        }
    }

    handleCollapse(_e) {
        if (this.state.expanded) {
            this.setState({expanded: false})
        }
    }

    hasRole(role) {
        return (
            USER_ROLES[role].includes(this.props.currentUser.role)
        )
    }


    renderMeetingType(meetingType, prefix = '') {
        return ((meetingType === 'standard') ? '' : `${prefix}${_.startCase(meetingType)}`)
    }

    handleProgramFormUpdate(program) {
        this.setState({program: program})
    }

    submitForm(e) {
        let newProgramItems = this.state.program.program_items.filter(item => {
            return ((item.id > 0) || (item.id < 0 && !item._destroy))
        }).map(item => (
            item.id < 0 ? Object.assign({}, item, {id: ''}) : item)
        )
        const {program} = this.state;
        let params = {
            meeting_type: program.meeting_type,
            date: program.date,
            presiding_id: program.presiding.id,
            conducting_id: program.conducting.id,
            prep_id: program.prep.id,
            chorister_id: program.chorister.id,
            organist_id: program.organist.id,
            opening_hymn_id: program.opening_hymn.id,
            intermediate_hymn_id: program.intermediate_hymn.id,
            sacrament_hymn_id: program.sacrament_hymn.id,
            closing_hymn_id: program.closing_hymn.id,
            opening_prayer: program.opening_prayer,
            closing_prayer: program.closing_prayer,
            notes: program.notes,
            program_items_attributes: newProgramItems
        }

        fetch("/api/v1/programs/" + this.props.program.id, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({program: result, dirty: false, showEditModal: false})
                },
                (error) => {
                    console.log('error saving program')
                    console.log(error)
                    this.setState({
                        error: error
                    });
                }
            )
    }

    renderModal() {
        const {program} = this.state;
        return (
            <Modal
                show={this.state.showEditModal}
                onHide={() => this.setState({showEditModal: false})}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {formatDateString(program.date, 'MMM do yyyy')}
                        {this.renderMeetingType(program.meeting_type, ' - ')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProgramForm
                        program={this.state.program}
                        currentUser={this.props.currentUser}
                        users={this.props.users}
                        hymns={this.props.hymns}
                        handleToUpdate={this.handleProgramFormUpdate.bind(this)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    {this.renderFormSubmitButton()}
                </Modal.Footer>
            </Modal>
        )
    }

    renderHymn(hymn) {
        if (hymn.name) {
            return (`#${hymn.page} - ${hymn.name}`)
        } else {
            return ('')
        }
    }

    renderPerson(person) {
        if (person.full_name) {
            return (person.full_name)
        } else {
            return ('')
        }
    }

    renderProgramNotes(notes) {
        if (notes) {
            return (
                <Col sm={12}>
                    <Card className={'notes'}>
                        <Card.Body>
                            <Card.Title>Notes</Card.Title>
                            <div>{notes}</div>
                        </Card.Body>
                    </Card>
                </Col>
            )
        } else {
            return ('')
        }
    }

    renderMusicNeeded(program) {
        return (
            !((program.chorister.id && program.organist.id && program.opening_hymn.id && program.sacrament_hymn.id && program.closing_hymn.id) ||
                isMeetingType(program.meeting_type, ['stake_conference', 'general_conference'])) ?
                <Badge pill bg={'warning'}>Music Needed</Badge> : ''
        )
    }

    renderPrayersNeeded(program) {
        return (
            !((program.opening_prayer && program.closing_prayer) || isMeetingType(program.meeting_type, ['stake_conference', 'general_conference'])) ?
                <Badge pill bg={'warning'}>Prayers Needed</Badge> : ''
        )
    }

    renderSpeakersNeeded(program) {
        return (
            !(
                (program.program_items.filter(i => ((i.item_type === 'speaker') && i.key)).length > 1) ||
                isMeetingType(program.meeting_type, ['fast_sunday', 'stake_conference', 'general_conference'])) ?
                <Badge pill bg="danger">Speakers Needed</Badge> : ''
        )
    }

    renderFormSubmitButton() {
        return (this.state.dirty ? <Button variant={"success"} onClick={(e) => this.submitForm(e)}>Save</Button> : '')
    }

    render() {
        const {program} = this.state;
        let renderParentClickable = `collapsable ${this.state.expanded ? 'parent-clickable' : ''}`;
        let intermediateHymn = '';
        if (program.intermediate_hymn.id) {
            intermediateHymn = <div><span
                className={'item-label'}>Intermediate Hymn:</span> {this.renderHymn(program.intermediate_hymn)}</div>
        }
        return (
            <Card id={this.state.program.is_next ? 'current-program' : ''} key={program.id}
                  className={`program-row ${this.state.expanded ? 'expanded' : 'collapsed no-focus clickable'}`}
                  onClick={(e) => this.handleExpand(e)}>
                <Card.Body>
                    <Row>
                        <Col md={3} className={renderParentClickable}>
                            <Row>
                                <Col sm={12}>
                                    <div
                                        className={'date col-sm-12 col-md-auto '}>{formatDateString(program.date, 'MMM do')}</div>
                                    <div className={'meeting-type text-info col-sm-12 col-md-auto'}>
                                        {this.renderMeetingType(program.meeting_type)}
                                    </div>
                                </Col>
                                <Col sm={12}>
                                    <span
                                        className={'sacrament-prep text-secondary'}>Prep: {program.prep.full_name}</span>
                                </Col>
                                <Col sm={12}>
                                    <span
                                        className={'conducting text-secondary'}>Conduct: {program.conducting.full_name}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    {this.renderSpeakersNeeded(program)}
                                    {this.renderPrayersNeeded(program)}
                                    {this.renderMusicNeeded(program)}
                                </Col>
                            </Row>
                        </Col>
                        <Col md={9} className={renderParentClickable}>
                            <Row>
                                <Col md={6} className={renderParentClickable}>
                                    {isMeetingType(program.meeting_type, ['stake_conference', 'general_conference']) ? '' :
                                        <>
                                            {isMeetingType(this.state.program.meeting_type, ['fast_sunday']) ? '' :
                                                <ProgramItems cardTitle={'Program'} programItems={program.program_items}
                                                              itemTypes={['speaker', 'musical_number', 'program_other']}/>
                                            }
                                            <Col sm={12}>
                                                <Card className={'prayers'}>
                                                    <Card.Body>
                                                        <Card.Title>Prayers</Card.Title>
                                                        <div><span
                                                            className={'item-label'}>Opening:</span> {program.opening_prayer}
                                                        </div>
                                                        <div><span
                                                            className={'item-label'}>Closing:</span> {program.closing_prayer}
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </>
                                    }
                                    {this.renderProgramNotes(program.notes)}
                                </Col>
                                <Col md={6} className={renderParentClickable}>
                                    {isMeetingType(program.meeting_type, ['stake_conference', 'general_conference']) ? '' :
                                        <>
                                            <Col sm={12}>
                                                <Card className={'music'}>
                                                    <Card.Body>
                                                        <Card.Title>Music</Card.Title>
                                                        <div><span
                                                            className={'item-label'}>Chorister:</span> {program.chorister.full_name}
                                                        </div>
                                                        <div><span
                                                            className={'item-label'}>Organist:</span> {program.organist.full_name}
                                                        </div>
                                                        <div><span
                                                            className={'item-label'}>Opening Hymn:</span> {this.renderHymn(program.opening_hymn)}
                                                        </div>
                                                        <div><span
                                                            className={'item-label'}>Sacrament Hymn:</span> {this.renderHymn(program.sacrament_hymn)}
                                                        </div>
                                                        {intermediateHymn}
                                                        <div><span
                                                            className={'item-label'}>Closing Hymn:</span> {this.renderHymn(program.closing_hymn)}
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <ProgramItems cardTitle={'Announcements'}
                                                          programItems={program.program_items}
                                                          itemTypes={['announcement']}/>
                                            <ProgramItems cardTitle={'Sustainings'} programItems={program.program_items}
                                                          itemTypes={['sustaining']}/>
                                            <ProgramItems cardTitle={'Releases'} programItems={program.program_items}
                                                          itemTypes={['release']}/>
                                        </>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6} className={renderParentClickable}>
                            <Button onClick={(e) => this.handleEdit(e)}>Edit</Button>
                            {this.renderFormSubmitButton()}
                        </Col>
                        <Col sm={6} className={`${renderParentClickable} text-end`}>
                            {this.state.expanded ? <ChevronCompactUp/> : <ChevronCompactDown/>}
                        </Col>
                        {this.renderModal()}
                    </Row>
                </Card.Body>
            </Card>
        );
    }
}

export default ProgramRow