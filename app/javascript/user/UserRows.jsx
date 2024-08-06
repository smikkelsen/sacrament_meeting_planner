import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, Form, Row, Col, Table, FloatingLabel} from 'react-bootstrap';
import _ from "lodash";
import {boolToStr} from "../common/utils";
import {CheckLg, XLg} from 'react-bootstrap-icons';
import {updateUser} from "../common/api";


class UserRows extends React.Component {

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.renderFormInput = this.renderFormInput.bind(this);
        this.renderFormSelect = this.renderFormSelect.bind(this);
        this.renderFormCheck = this.renderFormCheck.bind(this);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.renderRoleValue = this.renderRoleValue.bind(this);
        this.renderEditModal = this.renderEditModal.bind(this);

        this.state = {
            users: this.props.users,
            showEditModal: false,
            dirty: false
        };
    }

    submitForm(_e) {
        const {editUser} = this.state;
        let params = {
            first_name: editUser.first_name,
            last_name: editUser.last_name,
            display_name: editUser.display_name,
            prefix: editUser.prefix,
            email: editUser.email,
            role: editUser.role,
            prepper: editUser.prepper,
            organist: editUser.organist,
            chorister: editUser.chorister,
            conductor: editUser.conductor,
            workflow_state: editUser.workflow_state
        }

        updateUser(editUser.id, params).then(
            (result) => {
                console.log(result)
                this.setState(prevState => ({
                    users: prevState.users.map(u => (u.id === editUser.id ? result : u)),
                    isLoaded: true,
                    editUser: null,
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

    handleInputChange(e) {
        this.setState(prevState => {
            return {dirty: true, editUser: {...prevState.editUser, [e.target.id]: e.target.value}}
        })
    }

    handleCheckChange(e) {
        this.setState(prevState => {
            return {dirty: true, editUser: {...prevState.editUser, [e.target.id]: e.target.checked}}
        })
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state.editUser, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    renderRoleValue(roleStr) {
        let role = this.props.roles.filter(function (r) {
            return r.label.toLowerCase() === roleStr
        })[0]
        if (role) {
            return (role.id)
        } else {
            return ('')
        }
    }

    handleEdit(_e, user) {
        this.setState({editUser: user, showEditModal: true})
    }

    renderFormSubmitButton() {
        return (this.state.dirty ? <Button variant={"success"} onClick={(e) => this.submitForm(e)}>Save</Button> : '')
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
                    <option></option>
                    {options.map(opt => (
                        <option key={opt.id} value={opt[optionValue]}>{opt[optionLabel]}</option>
                    ))}
                </Form.Select>
            </FloatingLabel>
        )
    }

    renderFormCheck(label, attributeId) {
        return (
            <Form.Check // prettier-ignore
                type="switch"
                id={attributeId}
                label={label}
                onChange={(e) => this.handleCheckChange(e)}
                checked={this.renderInputValue(attributeId)}
            />
        )
    }

    renderForm() {
        return (
            <Form>
                <Row className={'input-row'}>
                    <Col md={6} sm={12}>
                        {this.renderFormInput('First Name', 'first_name')}
                    </Col>
                    <Col md={6} sm={12}>
                        {this.renderFormInput('Last Name', 'last_name')}
                    </Col>
                </Row>
                <Row className={'input-row'}>
                    <Col md={6} sm={12}>
                        {this.renderFormSelect('Prefix', 'prefix',
                            [
                                {'k': 'brother', 'v': 'Brother'},
                                {'k': 'sister', 'v': 'Sister'},
                                {'k': 'bishop', 'v': 'Bishop'},
                                {'k': 'president', 'v': 'President'},
                                {'k': 'elder', 'v': 'Elder'},
                            ], 'k', 'v'
                        )}
                    </Col>
                    <Col md={6} sm={12}>
                        {this.renderFormInput('Display Name', 'display_name')}
                    </Col>
                </Row>
                <Row className={'input-row'}>
                    <Col sm={12}>
                        {this.renderFormInput('Email', 'email')}
                    </Col>
                </Row>
                <Row className={'input-row'}>
                    <Col md={6} sm={12}>
                        {this.renderFormSelect('Role', 'role',
                            this.props.roles,
                            'value',
                            'label'
                        )}
                    </Col>
                    <Col md={6} sm={12}>
                        {this.renderFormSelect('Workflow State', 'workflow_state',
                            [
                                {'k': 'active', 'v': 'Active'},
                                {'k': 'archived', 'v': 'Archived'},
                            ], 'k', 'v'
                        )}
                    </Col>
                </Row>
                <Row className={'input-row'}>
                    <Col sm={12}>
                        {this.renderFormCheck('Sacrament Meeting Prepper', 'prepper')}
                    </Col>
                    <Col sm={12}>
                        {this.renderFormCheck('Sacrament Meeting Conductor', 'conductor')}
                    </Col>
                    <Col sm={12}>
                        {this.renderFormCheck('Chorister', 'chorister')}
                    </Col>
                    <Col sm={12}>
                        {this.renderFormCheck('Organist', 'organist')}
                    </Col>
                </Row>
            </Form>
        )
    }

    renderEditModal() {
        const {editUser} = this.state;
        if (editUser) {
            return (
                <Modal
                    show={this.state.showEditModal}
                    onHide={() => this.setState({showEditModal: false})}
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editUser.full_name}
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

    renderBoolIcon(bool) {
        return (
            bool ? <CheckLg className={'green'}/> : <XLg className={'red'}/>
        )
    }

    render() {
        return (
            <>
                <Table id={'users-container'}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Prep</th>
                        <th>Conduct</th>
                        <th>Chorister</th>
                        <th>Organist</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.users.map(user => (
                        <tr key={user.id}>
                            <td>{user.full_name}</td>
                            <td>{_.startCase(user.role)}</td>
                            <td>{this.renderBoolIcon(user.prepper)}</td>
                            <td>{this.renderBoolIcon(user.conductor)}</td>
                            <td>{this.renderBoolIcon(user.chorister)}</td>
                            <td>{this.renderBoolIcon(user.organist)}</td>
                            <td><Button className={'btn-sm'}
                                        onClick={(e) => this.handleEdit(e, user)}>
                                Edit</Button></td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                {this.renderEditModal()}
            </>
        );
    }
}

export default UserRows