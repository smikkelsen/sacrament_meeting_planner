import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card'
import {FloatingLabel} from "react-bootstrap";
import {fetchTemplates} from "../common/api";
import {fetchProgramTemplate} from "../common/api";

const _ = require('lodash');

const USER_ROLES = {
    admin: ['admin'],
    bishopric: ['bishopric', 'bishop', 'admin'],
    clerk: ['clerk', 'bishopric', 'bishop', 'admin'],
    music: ['music', 'clerk', 'bishopric', 'bishop', 'admin']
}

class TemplateForm extends React.Component {

    constructor(props) {
        super(props);
        this.renderTemplateBody = this.renderTemplateBody.bind(this);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.handleTemplateChange = this.handleTemplateChange.bind(this);
        this.handleGenerateClick = this.handleGenerateClick.bind(this);
        this.hasRole = this.hasRole.bind(this);
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

    hasRole(role) {
        return (
            USER_ROLES[role].includes(this.props.currentUser.role)
        )
    }

    render() {
        return (
            <Form>
                <FloatingLabel className={'input-row'} label={'Template'} controlId={'templateId'}>
                    <Form.Select
                        value={this.renderInputValue('templateId')}
                        onChange={(e) => this.handleTemplateChange(e)}
                        disabled={!this.hasRole('clerk')}>
                        <option value={''}>Choose Template</option>
                        {this.state.templates.map(template => (
                            <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
                <Button
                    disabled={!this.state.templateId}
                    onClick={(e) => this.handleGenerateClick('html')}
                    className={'mr-2'}
                    variant={'outline-primary'}>
                    Export Text
                </Button>
                <Button
                    disabled={!this.state.templateId}
                    onClick={(e) => this.handleGenerateClick('pdf')}
                    variant={'outline-primary'}>
                    Export PDF
                </Button>
                {this.renderTemplateBody()}
            </Form>
        )
    }
}

export default TemplateForm
