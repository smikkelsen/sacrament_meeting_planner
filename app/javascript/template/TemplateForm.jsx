import React from 'react';
import {useRef} from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
// import TaskDetail from './TaskDetail';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import {FloatingLabel} from "react-bootstrap";
import _ from "lodash";
import {Editor} from '@tinymce/tinymce-react';
import {upsertTemplate} from "../common/api";

// const editorRef = useRef(null);

// import {formatDateString, csrfToken} from '../common/utils.js';

class TemplateForm extends React.Component {

    constructor(props) {
        super(props);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePdfInputChange = this.handlePdfInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDirty = this.handleDirty.bind(this);
        this.renderEditor = this.renderEditor.bind(this);

        this.editorRef = React.createRef(null);
        this.state = {
            dirty: false,
            template: this.props.template
        };
    }


    handleSave() {
        let payload = this.state.template
        payload.body = this.editorRef.current.getContent()
        upsertTemplate(payload).then(
            (result) => {
                this.props.handleToUpdate(result)
                this.setState({template: result, dirty: false})
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

    handleClose() {
        this.props.handleToUpdate(null)  // set template to null in parent component
    }

    handleDirty(e) {
        this.setState({
            dirty: true
        });
    }

    handleInputChange(e) {
        this.setState(prevState => {
            return {dirty: true, template: {...prevState.template, [e.target.id]: e.target.value}}
        })
    }

    handlePdfInputChange(e) {
        let attrName = e.target.id.replace('pdf_', '')
        console.log(`updating ${attrName}`)
        this.setState(prevState => {
            return {
                dirty: true,
                template: {
                    ...prevState.template,
                    pdf_settings: {...prevState.template.pdf_settings, [attrName]: e.target.value}
                }
            }
        })
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state.template, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    renderEditor() {
        return (
            <Editor
                apiKey='jd31kzsrcz9m10ec8zphid3sicr70zflgld4iv3ps3q6bl5w'
                onChange={(e) => this.handleDirty(e)}
                onInit={(evt, editor) => this.editorRef.current = editor}
                initialValue={this.renderInputValue('body')}
                init={{
                    height: 600,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | insertvarbutton help',
                    setup: function (editor) {
                        /* Menu items are recreated when the menu is closed and opened, so we need
                           a variable to store the toggle menu item state. */
                        var toggleState = false;

                        /* example, adding a toolbar menu button */
                        editor.ui.registry.addMenuButton('insertvarbutton', {
                            text: 'Insert Variable',
                            fetch: function (callback) {
                                let test = []
                                let items = [
                                    {
                                        type: 'menuitem',
                                        text: 'Menu item 1',
                                        onAction: function () {
                                            editor.insertContent('&nbsp;<em>You clicked menu item 1!</em>');
                                        }
                                    },
                                    {
                                        type: 'nestedmenuitem',
                                        text: 'Menu item 2',
                                        icon: 'user',
                                        getSubmenuItems: function () {
                                            return [
                                                {
                                                    type: 'menuitem',
                                                    text: 'Sub menu item 1',
                                                    icon: 'unlock',
                                                    onAction: function () {
                                                        editor.insertContent('&nbsp;<em>You clicked Sub menu item 1!</em>');
                                                    }
                                                },
                                                {
                                                    type: 'menuitem',
                                                    text: 'Sub menu item 2',
                                                    icon: 'lock',
                                                    onAction: function () {
                                                        editor.insertContent('&nbsp;<em>You clicked Sub menu item 2!</em>');
                                                    }
                                                }
                                            ];
                                        }
                                    }
                                ];
                                callback(items);
                            }
                        });

                    },
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        )
    }

    render() {
        return (
            <Form>
                <Row>
                    <Col md={6} sm={12}>
                        <FloatingLabel className={'input-row'} label={'Name'}
                                       controlId={'name'}>
                            <Form.Control
                                value={this.renderInputValue('name')}
                                onChange={(e) => this.handleInputChange(e)}
                            />
                        </FloatingLabel>
                    </Col>
                    <Col sm={12} md={6}>
                        <FloatingLabel className={'input-row'} label={'Template Type'} controlId={'template_type'}>
                            <Form.Select
                                value={this.renderInputValue('template_type')}
                                onChange={(e) => this.handleInputChange(e)}
                            >
                                <option value={''}>Choose</option>
                                <option value={'program'}>Sacrament Meeting Program</option>
                                <option value={'conducting'}>Conducting Sheet</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>

                <Col sm={12}>
                    <Card className={'mt-3'}>
                        <Card.Body>
                            <Card.Title>
                                PDF Settings
                            </Card.Title>
                            <Row>
                                <Col sm={12} md={6} lg={4}>
                                    <FloatingLabel className={'input-row'} label={'Page Size'}
                                                   controlId={'pdf_page_size'}>
                                        <Form.Select
                                            value={this.renderInputValue('pdf_settings.page_size')}
                                            onChange={(e) => this.handlePdfInputChange(e)}
                                        >
                                            <option value={'Letter'}>Letter</option>
                                            <option value={'Legal'}>Legal</option>
                                            <option value={'Tabloid'}>Tabloid</option>
                                            <option value={'A0'}>A0</option>
                                            <option value={'A1'}>A1</option>
                                            <option value={'A2'}>A2</option>
                                            <option value={'A3'}>A3</option>
                                            <option value={'A4'}>A4</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col sm={12} md={6} lg={4}>
                                    <FloatingLabel className={'input-row'} label={'Orientation'}
                                                   controlId={'pdf_orientation'}>
                                        <Form.Select
                                            value={this.renderInputValue('pdf_settings.orientation')}
                                            onChange={(e) => this.handlePdfInputChange(e)}
                                        >
                                            <option value={'Portrait'}>Portrait</option>
                                            <option value={'Landscape'}>Landscape</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row className={'mt-3'}>
                                <Col sm={12} md={6} lg={3}>
                                    <FloatingLabel className={'input-row'} label={'Page Margin Top'}
                                                   controlId={'pdf_margin_top'}>
                                        <Form.Control
                                            value={this.renderInputValue('pdf_settings.margin_top')}
                                            onChange={(e) => this.handlePdfInputChange(e)}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col sm={12} md={6} lg={3}>
                                    <FloatingLabel className={'input-row'} label={'Page Margin Bottom'}
                                                   controlId={'pdf_margin_bottom'}>
                                        <Form.Control
                                            value={this.renderInputValue('pdf_settings.margin_bottom')}
                                            onChange={(e) => this.handlePdfInputChange(e)}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col sm={12} md={6} lg={3}>
                                    <FloatingLabel className={'input-row'} label={'Page Margin Left'}
                                                   controlId={'pdf_margin_left'}>
                                        <Form.Control
                                            value={this.renderInputValue('pdf_settings.margin_left')}
                                            onChange={(e) => this.handlePdfInputChange(e)}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col sm={12} md={6} lg={3}>
                                    <FloatingLabel className={'input-row'} label={'Page Margin Right'}
                                                   controlId={'pdf_margin_right'}>
                                        <Form.Control
                                            value={this.renderInputValue('pdf_settings.margin_right')}
                                            onChange={(e) => this.handlePdfInputChange(e)}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} className={'tinymce-wrapper'}>
                    {this.renderEditor()}

                </Col>
                <Col sm={12}>
                    <Button variant={'success'}
                            disabled={!this.state.dirty}
                            className={'mr-2'}
                            onClick={(_e) => this.handleSave()}>
                        Save
                    </Button>
                    <Button variant={this.state.dirty ? 'danger' : 'secondary'}
                            onClick={(_e) => this.handleClose()}>
                        Cancel
                    </Button>
                </Col>
            </Form>

        )


    }
}

export default TemplateForm