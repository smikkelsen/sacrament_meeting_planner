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
        this.handleSave = this.handleSave.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDirty = this.handleDirty.bind(this);

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

    renderInputValue(attributeId) {
        let val = _.get(this.state.template, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    render() {
        return (
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
                    <Form>
                        <FloatingLabel className={''} label={'Template Type'} controlId={'template_type'}>
                            <Form.Select
                                value={this.renderInputValue('template_type')}
                                onChange={(e) => this.handleInputChange(e)}
                            >
                                <option value={''}>Choose</option>
                                <option value={'program'}>Sacrament Meeting Program</option>
                                <option value={'conducting'}>Conducting Sheet</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Form>
                </Col>
                <Col sm={12} className={'tinymce-wrapper'}>
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
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />

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

            </Row>
        )


    }
}

export default TemplateForm