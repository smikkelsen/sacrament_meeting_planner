import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {Trash3Fill} from 'react-bootstrap-icons';
import {humanize} from '../common/utils.js';
import Modal from "react-bootstrap/Modal";

const _ = require('lodash');

const USER_ROLES = {
    admin: ['admin'],
    bishopric: ['bishopric', 'bishop', 'admin'],
    clerk: ['clerk', 'bishopric', 'bishop', 'admin'],
    music: ['music', 'clerk', 'bishopric', 'bishop', 'admin']
}

class ProgramItemForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleProgramItemChange = this.handleProgramItemChange.bind(this);
        this.hasRole = this.hasRole.bind(this);
        this.addProgramItemToForm = this.addProgramItemToForm.bind(this);
        this.removeProgramItemFromForm = this.removeProgramItemFromForm.bind(this);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.renderSpeaker = this.renderSpeaker.bind(this);
        this.renderMusicalNumber = this.renderMusicalNumber.bind(this);
        this.renderProgramOther = this.renderProgramOther.bind(this);
        this.renderAnnouncement = this.renderAnnouncement.bind(this);
        this.renderRelease = this.renderRelease.bind(this);
        this.renderSustaining = this.renderSustaining.bind(this);
        this.singleType = this.singleType.bind(this);
        this.renderNew = this.renderNew.bind(this);
        this.renderTrelloModal = this.renderTrelloModal.bind(this);
        this.state = {
            programItems: this.props.programItems,
            showTrelloModal: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.programItems !== this.props.programItems) {
            this.setState(prevState => {
                return {...prevState, programItems: this.props.programItems}
            })
        }
    }

    renderInputValue(id, attributeId) {
        let obj = this.state.programItems.find(x => x.id === id)
        if (obj) {
            return (obj[attributeId])
        } else {
            return ('')
        }
    }

    addProgramItemToForm() {
        let newItems = this.state.programItems.concat({
            id: -(Math.floor(Math.random() * 1000000000)),
            item_type: this.props.addType,
            key: '',
            value: '',
            program_id: this.props.programId
        })
        this.props.handleToUpdate(newItems);
        this.setState({
            programItems: newItems
        })
    }

    removeProgramItemFromForm(id) {
        this.handleProgramItemChange(id, '_destroy', true)
    }

    handleProgramItemChange(id, key, value) {
        let newItems = this.state.programItems.map(item => (
            item.id === id ? Object.assign({}, item, {[key]: value}) : item));
        this.props.handleToUpdate(newItems);
        this.setState({
            programItems: newItems
        })
    }

    hasRole(role) {
        return (
            USER_ROLES[role].includes(this.props.currentUser.role)
        )
    }

    singleType() {
        return (this.props.itemTypes.length === 1);
    }

    renderSpeaker(item, index) {
        return (
            <Row className={'input-row'} key={index}>
                {this.singleType() ? '' : <h6>Speaker</h6>}
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            placeholder={'Speaker'}
                            value={this.renderInputValue(item.id, 'key')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                    </InputGroup>
                </Col>
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            placeholder={'Topic'}
                            id={`programItems[${index}].value`}
                            value={this.renderInputValue(item.id, 'value')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'value', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!this.hasRole('bishopric')}
                                variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

    renderMusicalNumber(item, index) {
        return (
            <Row className={'input-row'} key={index}>
                {this.singleType() ? '' : <h6>Musical Number</h6>}
                <Col sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            placeholder={'Title'}
                            value={this.renderInputValue(item.id, 'key')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!this.hasRole('bishopric')}
                                variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

    renderProgramOther(item, index) {
        return (
            <Row className={'input-row'} key={index}>
                {this.singleType() ? '' : <h6>Other</h6>}
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            placeholder={'Title'}
                            value={this.renderInputValue(item.id, 'key')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                    </InputGroup>
                </Col>
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].value`}
                            placeholder={'Value'}
                            value={this.renderInputValue(item.id, 'value')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'value', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!this.hasRole('bishopric')}
                                variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

    renderAnnouncement(item, index) {
        return (
            <Row className={'input-row'} key={index}>
                {this.singleType() ? '' : <h6>Announcement</h6>}
                <Col sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            placeholder={'Title'}
                            value={this.renderInputValue(item.id, 'key')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!this.hasRole('bishopric')}
                                variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

    renderRelease(item, index) {
        return (
            <Row className={'input-row'} key={index}>
                {this.singleType() ? '' : <h6>Release</h6>}
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            placeholder={'Person'}
                            value={this.renderInputValue(item.id, 'key')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                    </InputGroup>
                </Col>
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            placeholder={'Calling'}
                            id={`programItems[${index}].value`}
                            value={this.renderInputValue(item.id, 'value')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'value', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!this.hasRole('bishopric')}
                                variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

    renderSustaining(item, index) {
        return (
            <Row className={'input-row'} key={index}>
                {this.singleType() ? '' : <h6>Sustaining</h6>}
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            placeholder={'Person'}
                            value={this.renderInputValue(item.id, 'key')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                    </InputGroup>
                </Col>
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            placeholder={'Calling'}
                            id={`programItems[${index}].value`}
                            value={this.renderInputValue(item.id, 'value')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'value', e.target.value)}
                            disabled={!this.hasRole('bishopric')}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!this.hasRole('bishopric')}
                                variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

    renderNew(item, index) {
        return (
            <Row className={'input-row'} key={index}>
                <Col sm={12}>
                    <InputGroup>
                        <Form.Select
                            id={`programItems.${this.props.addType}[${index}].item_type`}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'item_type', e.target.value)}
                            value={this.renderInputValue(item.id, 'item_type')}>
                            <option value={this.props.addType}>Choose Type</option>
                            {this.props.itemTypes.map((type, index) => (
                                <option key={index} value={type}>{humanize(type)}</option>
                            ))}
                        </Form.Select>
                        <Button
                            onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                            variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }


    handleTrelloImport() {
        this.setState({showTrelloModal: true})
    }

    renderTrelloModal() {
        return (
            <Modal
                show={this.state.showTrelloModal}
                onHide={() => this.setState({showTrelloModal: false, listType: ''})}
                size="xlg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Import {this.props.addType} Cards
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        let itemInputs = [];
        this.state.programItems.forEach((item, index) => {
            if (!this.props.itemTypes.concat(this.props.addType).includes(item.item_type)) {
                return;
            }
            if (item._destroy) {
                return;
            }

            switch (item.item_type) {
                case 'speaker':
                    itemInputs.push(this.renderSpeaker(item, index));
                    break;
                case 'musical_number':
                    itemInputs.push(this.renderMusicalNumber(item, index));
                    break;
                case 'program_other':
                    itemInputs.push(this.renderProgramOther(item, index));
                    break;
                case 'announcement':
                    itemInputs.push(this.renderAnnouncement(item, index));
                    break;
                case 'release':
                    itemInputs.push(this.renderRelease(item, index));
                    break;
                case 'sustaining':
                    itemInputs.push(this.renderSustaining(item, index));
                    break;
                case 'program_new':
                case 'announcement_new':
                case 'sustaining_new':
                case 'release_new':
                    itemInputs.push(this.renderNew(item, index));
                    break;
            }
        })
        return (
            <>
                {itemInputs}
                {this.renderTrelloModal()}
                <Button onClick={(_e) => this.addProgramItemToForm()}
                        disabled={!this.hasRole('bishopric')}>Add</Button>
                <Button onClick={(e) => this.handleTrelloImport()}
                        className={'ms-2'}>
                    Import
                </Button>
            </>
        )
    }
}

export default ProgramItemForm
