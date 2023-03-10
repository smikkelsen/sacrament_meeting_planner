import React from 'react';
import { useRef } from 'react';
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
import { Editor } from '@tinymce/tinymce-react';

// const editorRef = useRef(null);

// import {formatDateString, csrfToken} from '../common/utils.js';

class TemplateForm extends React.Component {

    constructor(props) {
        super(props);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.editorRef = React.createRef(null);
        this.state = {
            template: this.props.template
        };
    }


    handleSave() {
        console.log(this.editorRef.current.getContent())
    }

    handleInputChange(e) {
        this.setState(prevState => {
            return {program: {...prevState.program, [e.target.id]: e.target.value}}
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
            <Row>
                <Col sm={12}>
                <span>Go Back</span>
                </Col>
                <Col sm={12}>

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
                <Col sm={12}>
                    <Editor
                        apiKey='jd31kzsrcz9m10ec8zphid3sicr70zflgld4iv3ps3q6bl5w'
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
                    <Button onClick={(_e) => this.handleSave()}>Save</Button>
                </Col>
            </Row>
        )


    }
}

export default TemplateForm