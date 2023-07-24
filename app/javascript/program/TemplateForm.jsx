import React from 'react';
import {Button, Form, Card} from 'react-bootstrap';
import {FloatingLabel} from "react-bootstrap";
import {fetchTemplates, fetchProgramTemplate} from "../common/api";
import {FileEarmarkFontFill, FileEarmarkPdfFill, FiletypeDocx} from 'react-bootstrap-icons';
import {hasRole} from '../common/roles.js';

const _ = require('lodash');

class TemplateForm extends React.Component {

    constructor(props) {
        super(props);
        this.renderTemplateBody = this.renderTemplateBody.bind(this);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.handleTemplateChange = this.handleTemplateChange.bind(this);
        this.handleGenerateClick = this.handleGenerateClick.bind(this);
        this.state = {
            templates: [],
            templateId: '',
            templateBody: '',
            error: ''
        };
    }

    componentDidMount() {
        fetchTemplates().then(
            (result) => {
                this.setState({
                    templates: result.templates
                });
            },
            (error) => {
                console.log('failed to load templates');
                this.setState({
                    error: error
                });
            }
        );
    }

    handleTemplateChange(e) {
        this.setState({templateId: e.target.value});
        if (e.target.value) {
            fetchProgramTemplate(this.props.program.id, e.target.value).then(
                (result) => {
                    this.setState({
                        templateBody: result.body
                    });
                },
                (error) => {
                    console.log('failed to generate template');
                    this.setState({
                        error: error
                    });
                }
            );
        }
    }

    handleGenerateClick(templateFormat) {
        let url = `/programs/${this.props.program.id}/templates/${this.state.templateId}/generate.${templateFormat}`
        window.open(url, '_blank', 'noreferrer')
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    renderTemplateBody() {
        if (this.state.templateBody) {
            return (
                <Card className={'mt-3'}>
                    <Card.Body>
                        <div dangerouslySetInnerHTML={{__html: this.state.templateBody}}/>
                    </Card.Body>
                </Card>
            )
        } else {
            return ('')
        }
    }

    render() {
        return (
            <Form>
                <FloatingLabel className={'input-row'} label={'Template'} controlId={'templateId'}>
                    <Form.Select
                        value={this.renderInputValue('templateId')}
                        onChange={(e) => this.handleTemplateChange(e)}
                        disabled={!hasRole('clerk', this.props.currentUser.role)}>
                        <option value={''}>Choose Template</option>
                        {this.state.templates.map(template => (
                            <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
                <Button
                    disabled={!this.state.templateId}
                    onClick={(e) => this.handleGenerateClick('html')}
                    className={'me-2'}
                    variant={'outline-primary'}>
                    <FileEarmarkFontFill className={'me-2'}/> Text
                </Button>
                <Button
                    disabled={!this.state.templateId}
                    onClick={(e) => this.handleGenerateClick('docx')}
                    className={'me-2'}
                    variant={'outline-primary'}>
                    <FiletypeDocx className={'me-2'} /> DocX
                </Button>
                <Button
                    disabled={!this.state.templateId}
                    onClick={(e) => this.handleGenerateClick('pdf')}
                    variant={'outline-primary'}>
                    <FileEarmarkPdfFill className={'me-2'} /> PDF
                </Button>
                {this.renderTemplateBody()}
            </Form>
        )
    }
}

export default TemplateForm
