import React from 'react';
import {Spinner, Col, Row, InputGroup, Form, Button, Modal} from "react-bootstrap";
import {Trash3Fill, CloudArrowDownFill} from 'react-bootstrap-icons';
import {findArrayElementByAttribute, humanize} from '../common/utils.js';
import {hasRole} from '../common/roles.js';
import {fetchTrelloListCards} from "../common/api";

const _ = require('lodash');

class ProgramItemForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleProgramItemChange = this.handleProgramItemChange.bind(this);
        this.addProgramItemsToForm = this.addProgramItemsToForm.bind(this);
        this.removeProgramItemFromForm = this.removeProgramItemFromForm.bind(this);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.singleType = this.singleType.bind(this);
        this.renderNew = this.renderNew.bind(this);
        this.renderTrelloModal = this.renderTrelloModal.bind(this);
        this.hasTrelloImport = this.hasTrelloImport.bind(this);
        this.renderTrelloImportButtonText = this.renderTrelloImportButtonText.bind(this);
        this.state = {
            programItems: this.props.programItems,
            showTrelloModal: false,
            importingTrello: false,
            draggingItem: null,
            trelloItems: [],
            trelloItemValues: []
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

    addProgramItemsToForm(items) {
        let newItems = this.state.programItems
        items.forEach((item) => {
            newItems.push({
                id: -(Math.floor(Math.random() * 1000000000)),
                item_type: this.props.addType,
                key: item.key,
                value: item.value,
                program_id: this.props.programId
            })
        })
        this.props.handleToUpdate(newItems);
        this.setState({
            programItems: newItems
        })
    }

    removeProgramItemFromForm(id) {
        this.handleProgramItemChange(id, '_destroy', true)
    }

    handleProgramItemTypeChange(id, itemType) {
        if(itemType === "intermediate_hymn") {
            this.handleProgramItemChange(id, 'key', '0', 'item_type', itemType)
        } else {
            this.handleProgramItemChange(id, 'item_type', itemType)
        }
    }

    // (id, key1, value1, [key2, value2, ...])
    handleProgramItemChange() {
        let id = arguments[0]
        let newItems = this.state.programItems;
        for (var i = 1; i < arguments.length; i += 2) {
            newItems = newItems.map(item => (
                item.id === id ? Object.assign({}, item, {[arguments[i]]: arguments[i+1]}) : item));
        }

        this.props.handleToUpdate(newItems);
        this.setState({
            programItems: newItems
        })
    }

    singleType() {
        return (this.props.itemTypes.length === 1);
    }

    renderNoBox(item, index, heading, value) {
        return (
            <Row key={index}
                 className=
                     {`input-row item ${item === this.state.draggingItem ?
                         'dragging' : ''
                     }`}
                 draggable={true}
                 onDragStart={(e) => this.handleDragStart(e, item)}
                 onDragEnd={this.handleDragEnd}
                 onDragOver={this.handleDragOver}
                 onDrop={(e) => this.handleDrop(e, item)}
            >
                {this.singleType() ? '' : <h6>{heading}</h6>}
                <Col sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            value={value}
                            disabled={true}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!hasRole('bishopric', this.props.currentUser.role)}
                                variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

    renderOneBox(item, index, heading, label) {
        return (
            <Row key={index}
                 className=
                     {`input-row item ${item === this.state.draggingItem ?
                         'dragging' : ''
                     }`}
                 draggable={true}
                 onDragStart={(e) => this.handleDragStart(e, item)}
                 onDragEnd={this.handleDragEnd}
                 onDragOver={this.handleDragOver}
                 onDrop={(e) => this.handleDrop(e, item)}
            >
                {this.singleType() ? '' : <h6>{heading}</h6>}
                <Col sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            placeholder={label}
                            value={this.renderInputValue(item.id, 'key')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
                            disabled={!hasRole('bishopric', this.props.currentUser.role)}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!hasRole('bishopric', this.props.currentUser.role)}
                                variant={'danger'}><Trash3Fill/></Button>
                    </InputGroup>
                </Col>
            </Row>
        )
    }

    renderTwoBox(item, index, heading, label1, label2) {
        return (
            <Row key={index}
                 className=
                     {`input-row item ${item === this.state.draggingItem ?
                         'dragging' : ''
                     }`}
                 draggable={true}
                 onDragStart={(e) => this.handleDragStart(e, item)}
                 onDragEnd={this.handleDragEnd}
                 onDragOver={this.handleDragOver}
                 onDrop={(e) => this.handleDrop(e, item)}
            >
                {this.singleType() ? '' : <h6>{heading}</h6>}
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            id={`programItems[${index}].key`}
                            placeholder={label1}
                            value={this.renderInputValue(item.id, 'key')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
                            disabled={!hasRole('bishopric', this.props.currentUser.role)}/>
                    </InputGroup>
                </Col>
                <Col md={6} sm={12}>
                    <InputGroup>
                        <Form.Control
                            placeholder={label2}
                            id={`programItems[${index}].value`}
                            value={this.renderInputValue(item.id, 'value')}
                            onChange={(e) => this.handleProgramItemChange(item.id, 'value', e.target.value)}
                            disabled={!hasRole('bishopric', this.props.currentUser.role)}/>
                        <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
                                disabled={!hasRole('bishopric', this.props.currentUser.role)}
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
                            onChange={(e) => this.handleProgramItemTypeChange(item.id, e.target.value)}
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

    hasTrelloImport() {
        return (['sustaining', 'release'].includes(this.props.addType))
    }

    handleTrelloImport() {
        if (this.hasTrelloImport()) {
            this.setState({importingTrello: true},
                function () {
                    fetchTrelloListCards(this.props.addType).then(
                        (result) => {
                            let trelloItemValues = result.cards.map((item) => (
                                {id: item.id, name: item.name, checked: true}
                            ))
                            this.setState({
                                showTrelloModal: true, importingTrello: false, trelloItems: result.cards,
                                trelloItemValues: trelloItemValues
                            })
                        },
                        (error) => {
                            console.log('error fetching trello cards')
                            console.log(error)
                            this.setState({
                                error: error
                            });
                        }
                    )
                }
            )
        }
    }

    handleAddFromTrello() {
        let newItems = []
        this.state.trelloItemValues.forEach((item, index) => {
            if (item.checked) {
                let arr = item.name.split(/ \(release\) | \(call\) | \(sustain\) | - +/i)
                newItems.push({key: arr[0], value: arr[1]})
            }
        })
        this.setState({showTrelloModal: false}, () => {
            if (newItems.length > 0) {
                this.addProgramItemsToForm(newItems)
            }
        })
    }

    handleTrelloItemChecked(itemId, value) {
        let newItems = this.state.trelloItemValues.map(item => (
            item.id === itemId ? Object.assign({}, item, {checked: value}) : item));
        this.setState({trelloItemValues: newItems})
    }

    renderTrelloItemChecked(itemId) {
        return (findArrayElementByAttribute(this.state.trelloItemValues, itemId).checked)
    }

    renderTrelloModal() {
        return (
            <Modal
                show={this.state.showTrelloModal}
                onHide={() => this.setState({showTrelloModal: false, listType: ''})}
                className={'top-modal'}
                dialogClassName={'dialog-top-modal'}
                backdropClassName={'top-modal-backdrop'}
                size="md"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Import {humanize(this.props.addType)} Cards
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        {this.state.trelloItems.map((item, index) => (
                            <Form.Check
                                checked={this.renderTrelloItemChecked(item.id)}
                                onChange={(e) => this.handleTrelloItemChecked(item.id, e.target.checked)}
                                key={index}
                                type={'checkbox'}
                                label={item.name}
                                id={item.id}
                            />
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={'me-2'} onClick={(_e) => this.handleAddFromTrello()}>Add Selected</Button>
                    <Button variant={'secondary'}
                            onClick={() => this.setState({showTrelloModal: false, listType: ''})}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderTrelloImportButtonText() {
        if (this.state.importingTrello) {
            return (
                <>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className={'me-2'}
                        role="status"
                        aria-hidden="true"
                    />
                    Loading...
                </>
            )
        } else {
            return (
                <>
                    <CloudArrowDownFill className={'me-2'}/>
                    Import From Trello
                </>
            )
        }
    }

    handleDragStart = (e, item) => {
        this.setState({ draggingItem: item });
        e.dataTransfer.setData('text/plain', '');
    };

    handleDragEnd = () => {
        this.setState({ draggingItem: null });
    };

    handleDragOver = (e) => {
        e.preventDefault();
    };

    handleDrop = (e, targetItem) => {
        const { draggingItem, programItems } = this.state;
        if (!draggingItem) return;

        const currentIndex = programItems.indexOf(draggingItem);
        const targetIndex = programItems.indexOf(targetItem);

        if (currentIndex !== -1 && targetIndex !== -1) {
            programItems.splice(currentIndex, 1);
            programItems.splice(targetIndex, 0, draggingItem);
            programItems.forEach((item, index) => {
                item['position'] = index
            });
            this.props.handleToUpdate(programItems);
            this.setState({ programItems });
        }
    };

    render() {
        let itemInputs = [];
        let text = '';
        this.state.programItems.forEach((item, index) => {
            if (!this.props.itemTypes.concat(this.props.addType).includes(item.item_type)) {
                return;
            }
            if (item._destroy) {
                return;
            }

            switch (item.item_type) {
                case 'speaker':
                    itemInputs.push(this.renderTwoBox(item, index, 'Speaker', 'Speaker', 'Topic'));
                    break;
                case 'intermediate_hymn':
                    itemInputs.push(this.renderNoBox(item, index, 'Intermediate Hymn', this.props.intermediateHymnText));
                    break;
                case 'musical_number':
                    itemInputs.push(this.renderOneBox(item, index, 'Musical Number', 'Title'));
                    break;
                case 'program_other':
                    itemInputs.push(this.renderTwoBox(item, index, 'Other', 'Title', 'Value'));
                    break;
                case 'announcement':
                    itemInputs.push(this.renderOneBox(item, index, 'Announcement', 'Title'));
                    break;
                case 'release':
                    itemInputs.push(this.renderTwoBox(item, index, 'Release', 'Person', 'Calling'));
                    break;
                case 'sustaining':
                    itemInputs.push(this.renderTwoBox(item, index, 'Sustaining', 'Person', 'Calling'));
                    break;
                case 'business':
                    itemInputs.push(this.renderOneBox(item, index, 'Business', 'Value'));
                    break;
                case 'program_new':
                case 'announcement_new':
                case 'sustaining_new':
                case 'business_new':
                case 'release_new':
                    itemInputs.push(this.renderNew(item, index));
                    break;
            }
        })
        return (
            <>
                {itemInputs}

                <Button onClick={(_e) => this.addProgramItemsToForm([{key: '', value: ''}])}
                        disabled={!hasRole('bishopric', this.props.currentUser.role)}>Add</Button>
                {this.hasTrelloImport() ?
                    <>
                        <Button disabled={
                            this.state.importingTrello ||
                            !hasRole('bishopric', this.props.currentUser.role)
                        } onClick={(e) => this.handleTrelloImport()}
                                className={'ms-2'}>
                            {this.renderTrelloImportButtonText()}
                        </Button>
                        {this.renderTrelloModal()}
                    </> : ''}

            </>
        )
    }
}

export default ProgramItemForm
