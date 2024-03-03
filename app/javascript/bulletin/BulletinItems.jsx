import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, Form, Row, Col, Table, FloatingLabel, Card} from 'react-bootstrap';
import _ from "lodash";
import {formatDateString} from "../common/date";
import moment from "moment"
import Datetime from 'react-datetime';
import {
    updateBulletinItem,
    createBulletinItem,
    updateBulletinItemPositions,
    destroyBulletinItem
} from "../common/api";


class BulletinItems extends React.Component {

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.renderFormInput = this.renderFormInput.bind(this);
        this.renderFormSelect = this.renderFormSelect.bind(this);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.renderEditModal = this.renderEditModal.bind(this);

        this.state = {
            bulletin_items: this.props.bulletin_items,
            showEditModal: false,
            editItem: null,
            dirty: false,
            draggingItem: null
        };
    }

    submitForm(_e) {
        const {editItem} = this.state;
        let params = {
            item_type: editItem.item_type,
            date: editItem.date,
            time: editItem.time,
            message: editItem.message,
            position: editItem.position,
            _destroy: editItem._destroy
        }
         console.log(params)
        if (editItem.id == -1) {
            createBulletinItem(params).then(
                (result) => {
                    this.setState(prevState => ({
                        bulletin_items: prevState.bulletin_items.concat(result),
                        isLoaded: true,
                        editItem: null,
                        dirty: false,
                    }))
                },
                (error) => {
                    console.log('failed update user');
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
        } else {
            updateBulletinItem(editItem.id, params).then(
                (result) => {
                    this.setState(prevState => ({
                        bulletin_items: prevState.bulletin_items.map(item => (item.id === editItem.id ? result : item)),
                        isLoaded: true,
                        editItem: null,
                        dirty: false,
                    }))
                },
                (error) => {
                    console.log('failed update user');
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
        }

    }

    handleDragStart = (e, item) => {
        this.setState({draggingItem: item});
        e.dataTransfer.setData('text/plain', '');
    };

    handleDragEnd = () => {
        this.setState({draggingItem: null});
    };

    handleDragOver = (e) => {
        e.preventDefault();
    };

    handleDrop = (e, targetItem) => {
        const {draggingItem, bulletin_items} = this.state;
        if (!draggingItem) return;

        const currentIndex = bulletin_items.indexOf(draggingItem);
        const targetIndex = bulletin_items.indexOf(targetItem);

        if (currentIndex !== -1 && targetIndex !== -1) {
            bulletin_items.splice(currentIndex, 1);
            bulletin_items.splice(targetIndex, 0, draggingItem);
            bulletin_items.forEach((item, index) => {
                item['position'] = index
            });
            this.setState({bulletin_items});
            var payload = bulletin_items.map(e => ({id: e.id, position: e.position}))
            updateBulletinItemPositions(payload)
        }
    };

    handleInputChange(e) {
        this.setState(prevState => {
            return {dirty: true, editItem: {...prevState.editItem, [e.target.id]: e.target.value}}
        })
    }

    handleDateInputChange(attribute, date) {
        this.setState(prevState => {
            return {dirty: true, editItem: {...prevState.editItem, [attribute]: date.toString()}}
        })
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state.editItem, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    handleEdit(_e, item) {
        this.setState({editItem: item, showEditModal: true})
    }

    handleDelete(_e, item) {
        destroyBulletinItem(item['id']).then(
            (_result) => {
                this.handleItemChange(item.id, '_destroy', true)
            },
            (error) => {
                console.log('failed to destroy bulletin item');
                console.log(error);
            }
        )
    }

    handleItemChange() {
        let id = arguments[0]
        let newItems = this.state.bulletin_items;
        for (var i = 1; i < arguments.length; i += 2) {
            newItems = newItems.map(item => (
                item.id === id ? Object.assign({}, item, {[arguments[i]]: arguments[i+1]}) : item));
        }

        this.setState({
            bulletin_items: newItems
        })
    }

    renderFormSubmitButton() {
        var label = (this.state.editItem.id === -1) ? 'Create' : 'Save'
        return (this.state.dirty ?
            <Button variant={"success"} onClick={(e) => this.submitForm(e)}>{label}</Button> : '')
    }

    renderFormInput(label, attributeId) {
        return (
            <FloatingLabel label={label} controlId={attributeId}>
                <Form.Control
                    value={this.renderInputValue(attributeId)}
                    onChange={(e) => this.handleInputChange(e)}/>
            </FloatingLabel>
        )
    }

    renderFormSelect(label, attributeId, options, optionValue, optionLabel) {
        return (
            <FloatingLabel label={label} controlId={attributeId}>
                <Form.Select
                    id={attributeId}
                    value={this.renderInputValue(attributeId)}
                    onChange={(e) => this.handleInputChange(e)}>
                    <option key={0}></option>
                    {options.map(opt => (
                        <option key={opt['id']} value={opt[optionValue]}>{opt[optionLabel]}</option>
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
                        {this.renderFormSelect('Item Type', 'item_type',
                            this.props.bulletinItemTypes.map(i => ({
                                id: i['value'],
                                value: i['key'],
                                label: i['label']
                            })),
                            'value',
                            'label'
                        )}
                    </Col>
                </Row>
                <Row className={'input-row'}>
                    <Col md={6} sm={12}>
                        <Datetime
                            initialValue={this.state.editItem.date ? moment(this.state.editItem.date).format('MMM Do YYYY') : null}
                            dateFormat={'MMM Do YYYY'}
                            timeFormat={false}
                            className={''}
                            inputProps={{placeholder: 'Date'}}
                            onChange={(date) => this.handleDateInputChange('date', date)}
                        />
                    </Col>
                    <Col md={6} sm={12}>
                        <Datetime
                            initialValue={this.state.editItem.time ? moment(this.state.editItem.time).format('h:mm A') : null}
                            timeFormat={'h:mm A'}
                            dateFormat={false}
                            className={''}
                            inputProps={{placeholder: 'Time'}}
                            onChange={(time) => this.handleDateInputChange('time', time)}
                        />
                    </Col>
                </Row>
                <Row className={'input-row'}>
                    <Col sm={12}>
                        {this.renderFormInput('Message', 'message')}
                    </Col>
                </Row>
            </Form>
        )
    }

    renderEditModal() {
        const {editItem} = this.state;
        if (editItem) {
            return (
                <Modal
                    show={this.state.showEditModal}
                    onHide={() => this.setState({showEditModal: false})}
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit Bulletin Item
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.renderForm()}
                    </Modal.Body>
                    <Modal.Footer>
                        {this.renderFormSubmitButton()}
                    </Modal.Footer>
                </Modal>
            )
        }
    }

    handleAddItem(e) {
        let item = {
            id: -1, message: null, date: null, time: null,
            item_type: null, position: (this.state.bulletin_items.length + 1)
        }
        this.setState({editItem: item, showEditModal: true})
    }

    renderItemTable(itemType, label) {
        let filteredItems = this.state.bulletin_items.filter(item => ((item['item_type'] === itemType) && !item['_destroy']));
        if (filteredItems.length > 0) {
            return (
                <Row key={itemType}>
                    <Card className={'mt-3'}>
                        <Col sm={12} className={'card-body'}>
                            <h2>{label}</h2>
                            <Table id={'bulletin-container'}>

                                <tbody>
                                {filteredItems.map(item => (
                                    <tr key={item.id}
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
                                        <td>
                                            {formatDateString(item.date, 'MMM do', '')} {formatDateString(item.time, 'h:mm aaa', '')}
                                        </td>
                                        <td>{item.message}</td>
                                        <td>
                                            <Button variant={'outline-danger'} size={'sm'} className={'float-right'}
                                                    onClick={(e) => this.handleDelete(e, item)}>
                                                Delete</Button>
                                            <Button variant={'outline-primary'} size={'sm'}
                                                    className={'float-right me-2'}
                                                    onClick={(e) => this.handleEdit(e, item)}>
                                                Edit</Button>

                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Card>
                </Row>
            )
        } else {
            return ('')
        }

    }

    render() {
        return (
            <>
                <Row>
                    <Col sm={12}>
                        <Button variant={'success'} className={'float-right'}
                                onClick={(e) => this.handleAddItem(e)}>
                            Add
                        </Button>
                    </Col>
                </Row>
                {this.props.bulletinItemTypes.map(i => (
                    this.renderItemTable(i['key'], i['label'])
                ))}
                {this.renderEditModal()}
            </>
        );
    }
}

export default BulletinItems