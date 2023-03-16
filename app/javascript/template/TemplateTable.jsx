import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import TemplateForm from './TemplateForm';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class TemplateTable extends React.Component {

    constructor(props) {
        super(props);
        this.handleTemplateClick = this.handleTemplateClick.bind(this);
        this.handleTemplateFormUpdate = this.handleTemplateFormUpdate.bind(this);
        this.handleCreateTemplate = this.handleCreateTemplate.bind(this);
        this.updateTemplateRow = this.updateTemplateRow.bind(this);
        this.state = {
            showModal: false,
            templates: this.props.templates,
            template: null
        };
    }

    handleTemplateFormUpdate(template) {
        if(template) {
            this.updateTemplateRow(template)
        }
        this.setState({template: template})
    }

    updateTemplateRow(template) {
        let newTemplates = this.state.templates.map(t => (
            t.id === template.id ? template : t));
        this.setState({
            templates: newTemplates
        })
    }

    handleTemplateClick(template, e) {
        this.setState({
            template: template
        })
    }

    renderEdit() {
        return (
            <TemplateForm template={this.state.template}
                          handleToUpdate={this.handleTemplateFormUpdate.bind(this)}
            />
        )
    }

    handleCreateTemplate() {
        this.setState({
            template: {id: '', template_type: '', name: '', body: ''}
        })
    }

    renderTable() {
        return (
            <div>
                <Table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.templates.map(template => (
                        <tr key={template.id} onClick={(e) => this.handleTemplateClick(template, e)}>
                            <td>{template.name}</td>
                            <td>{template.template_type}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Button onClick={(_e) => this.handleCreateTemplate()}>New Template</Button>

            </div>
        );
    }

    render() {
        return (this.state.template ? this.renderEdit() : this.renderTable())
    }
}

export default TemplateTable