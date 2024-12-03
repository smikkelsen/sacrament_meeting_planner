import React from 'react';
import {Modal, Button, Row, Col, Card, Badge} from 'react-bootstrap';
import {formatDateString} from '../common/date.js';
import {hasRole} from '../common/roles.js';
import {isMeetingType} from './programHelpers.js';
import {ChevronCompactDown, ChevronCompactUp, Pencil, FileEarmarkPdf, BookmarkStarFill} from 'react-bootstrap-icons';
import ProgramItems from "./ProgramItems";
import ProgramForm from "./ProgramForm";
import TemplateForm from "./TemplateForm";
import {csrfToken} from "../common/api";
import {humanize} from "../common/utils";

const _ = require('lodash');

class ProgramRow extends React.Component {

    constructor(props) {
        super(props);
        this.handleProgramFormUpdate = this.handleProgramFormUpdate.bind(this);
        this.handleProgramFormDirty = this.handleProgramFormDirty.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleCollapse = this.handleCollapse.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleTemplate = this.handleTemplate.bind(this);
        this.renderEditModal = this.renderEditModal.bind(this);
        this.renderTemplateModal = this.renderTemplateModal.bind(this);
        this.renderProgramNotes = this.renderProgramNotes.bind(this);
        this.renderMeetingType = this.renderMeetingType.bind(this);
        this.renderHymn = this.renderHymn.bind(this);
        this.renderPerson = this.renderPerson.bind(this);
        this.renderSpeakersNeeded = this.renderSpeakersNeeded.bind(this);
        this.renderMusicNeeded = this.renderMusicNeeded.bind(this);
        this.renderPrayersNeeded = this.renderPrayersNeeded.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
        this.renderFormSubmitButton = this.renderFormSubmitButton.bind(this);
        this.dateFormatStr = this.dateFormatStr.bind(this);

        this.state = {
            showEditModal: false,
            showTemplateModal: false,
            expanded: this.props.program.is_next,
            program: this.props.program,
            dirty: false
        };
    }

    handleEdit(_e) {
        this.setState({showEditModal: true})
    }

    handleTemplate(_e) {
        this.setState({showTemplateModal: true})
    }

    handleExpand(_e) {
        if (this.state.expanded) {
            // if (event.target.classList.contains('collapsable')) {
            this.setState({expanded: false})
            // }
        } else {
            this.setState({expanded: true})
        }
    }

    handleCollapse(_e) {
        if (this.state.expanded) {
            this.setState({expanded: false})
        }
    }

    renderMeetingType(meetingType, prefix = '') {
        return ((meetingType === 'standard') ? '' : `${prefix}${_.startCase(meetingType)}`)
    }

    handleProgramFormUpdate(program) {
        // Only update if form dirty, or it my overwrite with unpersisted ID's
        if(this.state.dirty) {
            this.setState({program: program})
        }
    }

    handleProgramFormDirty(dirty) {
        this.setState({dirty: dirty})
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
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(params)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
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

    handlePublish() {
        let params = {
            published: !this.state.program.published,
        }

        fetch("/api/v1/programs/" + this.props.program.id, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(params)
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({program: result})
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

    renderEditModal() {
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
                        intermediateHymnText={this.intermediateHymnText()}
                        handleToUpdate={this.handleProgramFormUpdate.bind(this)}
                        handleToDirty={this.handleProgramFormDirty.bind(this)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    {this.renderFormSubmitButton()}
                </Modal.Footer>
            </Modal>
        )
    }

    renderTemplateModal() {
        const {program} = this.state;
        return (
            <Modal
                show={this.state.showTemplateModal}
                onHide={() => this.setState({showTemplateModal: false})}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Generate Template for {formatDateString(program.date, 'MMM do yyyy')}
                        {this.renderMeetingType(program.meeting_type, ' - ')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TemplateForm
                        program={this.state.program}
                        currentUser={this.props.currentUser}/>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        )
    }

    renderHymn(hymn) {
        if (hymn.name) {
            return (`${humanize(hymn.category)} #${hymn.page} - ${hymn.name}`)
        } else {
            return ('')
        }
    }

    intermediateHymnText() {
        let intermediateHymnText = this.renderHymn(this.state.program.intermediate_hymn)
        if (intermediateHymnText == '') {
            intermediateHymnText = 'No hymn selected'
        }
        return (intermediateHymnText)
    }

    renderPerson(person) {
        if (person.full_name) {
            return (person.full_name)
        } else {
            return ('')
        }
    }

    renderProgramNotes(notes) {
        if (notes && hasRole('clerk', this.props.currentUser.role)) {
            return (
                <Col sm={12}>
                    <Card className={'clerk'}>
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
                <Badge pill bg={'warning'} className={'me-1'}>Music Needed</Badge> : ''
        )
    }

    renderPrayersNeeded(program) {
        return (
            !((program.opening_prayer && program.closing_prayer) || isMeetingType(program.meeting_type, ['stake_conference', 'general_conference'])) ?
                <Badge pill bg={'warning'} className={'me-1'}>Prayers Needed</Badge> : ''
        )
    }

    renderSpeakersNeeded(program) {
        return (
            !(
                (program.program_items.filter(i => ((i.item_type === 'speaker') && i.key)).length > 1) ||
                isMeetingType(program.meeting_type, ['fast_sunday', 'stake_conference', 'general_conference'])) ?
                <Badge pill bg="danger" className={'me-1'}>Speakers Needed</Badge> : ''
        )
    }

    renderFormSubmitButton() {
        return (this.state.dirty ? <Button variant={"success"} className={'me-2'} onClick={(e) => this.submitForm(e)}>Save</Button> : '')
    }

    dateFormatStr() {
        let date = this.state.program.date;
        let year = formatDateString(date, 'yyyy');
        let today = new Date();
        today = formatDateString(today, 'yyyy');
        if (_.isEqual(today, year)) {
            return ('MMM do')
        } else {
            console.log(today + ' is not equal to ' + year)
            return ('MMM do yyyy')
        }

    }

    renderMusic(program) {
        if (isMeetingType(program.meeting_type, ['stake_conference', 'general_conference'])) {
            return ''
        } else {
            let intermediateHymn = '';
            if (program.intermediate_hymn.id) {
                intermediateHymn = <div><span
                    className={'item-label'}>Intermediate Hymn:</span> {this.renderHymn(program.intermediate_hymn)}
                </div>
            }
            return (
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
            )
        }
    }

    renderProgramAgenda(program) {
        if (isMeetingType(this.state.program.meeting_type, ['fast_sunday'])) {
            return ''
        } else {
            return (
                <ProgramItems cardTitle={'Program'} programItems={program.program_items}
                              intermediateHymnText={this.intermediateHymnText()}
                              itemTypes={['speaker', 'intermediate_hymn', 'musical_number', 'program_other']}/>
            )
        }
    }

    renderPrayers(program) {
        if (isMeetingType(program.meeting_type, ['stake_conference', 'general_conference'])) {
            return ''
        } else {
            return (
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
            )
        }
    }

    renderBusiness(program) {
        if (isMeetingType(program.meeting_type, ['stake_conference', 'general_conference'])) {
            return ''
        } else if (hasRole('clerk', this.props.currentUser.role)) {
            return (
                <>
                    <ProgramItems cardTitle={'Announcements'}
                                  programItems={program.program_items}
                                  itemTypes={['announcement']}/>
                    <ProgramItems cardTitle={'Sustainings'} programItems={program.program_items}
                                  itemTypes={['sustaining']}/>
                    <ProgramItems cardTitle={'Releases'} programItems={program.program_items}
                                  itemTypes={['release']}/>
                    <ProgramItems cardTitle={'Business'} programItems={program.program_items}
                                  itemTypes={['business']}/>
                </>
            )
        } else {
            return ('')
        }
    }

    renderPrep(program) {
        if (program.prep) {
            return (
                <Badge pill bg="secondary" className={'me-1 mb-1'}>
                    <span><b>Prep:</b> {program.prep.first_name}</span>
                </Badge>
            )
        } else {
            return ('')
        }
    }

    renderConduct(program) {
        if (program.conducting) {
            return (
                <Badge pill bg="secondary" className={'me-2 mb-1'}>
                    <span><b>Conduct:</b> {program.conducting.first_name}</span>
                </Badge>
            )
        } else {
            return ('')
        }
    }

    render() {
        const {program} = this.state;
        let renderParentClickable = ``;
        return (
            <Card id={this.state.program.is_next ? 'current-program' : ''} key={program.id}
                  className={`program-row ${this.state.expanded ? 'expanded' : 'collapsed no-focus'}`}
            >
                <Card.Header className={'collapsable clickable'}
                             onClick={(e) => this.handleExpand(e)}>
                    <div>
                        {this.state.program.is_next ?
                            <span className={'next-bookmark-icon'}><BookmarkStarFill/></span> : ''}
                        <span className={'date me-2'}>
                            {formatDateString(program.date, this.dateFormatStr())}
                        </span>
                        <span className={'meeting-type text-info  me-4 mb-1'}>
                            {this.renderMeetingType(program.meeting_type)}
                        </span>
                        {this.renderPrep(program)}
                        {this.renderConduct(program)}
                        {this.renderSpeakersNeeded(program)}
                        {this.renderPrayersNeeded(program)}
                        {this.renderMusicNeeded(program)}
                    </div>
                    <div className={'abs-top-right text-end'}>
                        {this.state.expanded ? <ChevronCompactUp/> : <ChevronCompactDown/>}
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col lg={6} md={12}>
                            <Row>
                                {this.renderPrayers(program)}
                                {this.renderProgramAgenda(program)}
                                {this.renderProgramNotes(program.notes)}
                            </Row>
                        </Col>
                        <Col lg={6} md={12}>
                            <Row>
                                {this.renderMusic(program)}
                                {this.renderBusiness(program)}
                            </Row>
                        </Col>
                        {this.renderEditModal()}
                        {this.renderTemplateModal()}
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <Col sm={12} className={renderParentClickable}>
                        <Button onClick={(e) => this.handleEdit(e)}
                                className={'me-2'}>
                            <Pencil className={'me-2'}/>
                            Edit
                        </Button>
                        {this.renderFormSubmitButton()}
                        <Button
                            disabled={!hasRole('clerk', this.props.currentUser.role)}
                            onClick={(e) => this.handleTemplate(e)}
                            className={'me-2'}>
                            <FileEarmarkPdf className={'me-2'}/>
                            Generate Template
                        </Button>
                        <Button
                            disabled={!hasRole('clerk', this.props.currentUser.role)}
                            onClick={() => this.handlePublish()}
                            className={'me-2'}>
                            {program.published ? 'Unpublish' : 'Publish'}
                        </Button>
                    </Col>
                </Card.Footer>
            </Card>
        );
    }
}

export default ProgramRow