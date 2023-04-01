import React from 'react';
import PropTypes from 'prop-types';
import {Button, Table} from 'react-bootstrap';
import TemplateForm from './TemplateForm';
import {humanize} from '../common/utils.js';
import {PencilSquare} from 'react-bootstrap-icons'

class TemplateTable extends React.Component {

    constructor(props) {
        super(props);
        this.handleTemplateEdit = this.handleTemplateEdit.bind(this);
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

    handleTemplateEdit(template, e) {
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
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.templates.map(template => (
                        <tr key={template.id} >
                            <td>{template.name}</td>
                            <td>{humanize(template.template_type)}</td>
                            <td>
                                    <PencilSquare color={'primary'} size={'1.5em'} className={'clickable'} onClick={(e) => this.handleTemplateEdit(template, e)}/>
                            </td>
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