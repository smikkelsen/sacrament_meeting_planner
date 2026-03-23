import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';

class HymnForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hymn: props.hymn || {
                name: '',
                page: '',
                category: 'hymn'
            },
            errors: {}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps) {
        // When the modal is opened, initialize/reset the form fields
        if (this.props.show && !prevProps.show) {
            this.setState({
                hymn: this.props.hymn || { name: '', page: '', category: 'hymn' },
                errors: {}
            });
        }
        // When switching into edit mode for a different hymn, sync fields
        if (
            this.props.isEditing &&
            this.props.hymn &&
            (!prevProps.hymn || this.props.hymn.id !== prevProps.hymn?.id)
        ) {
            this.setState({ hymn: this.props.hymn, errors: {} });
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState(prevState => ({
            hymn: {
                ...prevState.hymn,
                [name]: value
            },
            errors: {
                ...prevState.errors,
                [name]: null
            }
        }));
    }

    handleSubmit(e) {
        e.preventDefault();
        const { hymn } = this.state;

        // Basic validation
        const errors = {};
        if (!hymn.name || hymn.name.trim() === '') {
            errors.name = 'Name is required';
        }
        if (!hymn.page || hymn.page.trim() === '') {
            errors.page = 'Page number is required';
        }

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        this.props.onSave(hymn);
    }

    render() {
        const { show, onHide, isEditing } = this.props;
        const { hymn, errors } = this.state;

        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Hymn' : 'Add New Hymn'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={hymn.name}
                                onChange={this.handleChange}
                                isInvalid={!!errors.name}
                                placeholder="Enter hymn name"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Page <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="page"
                                value={hymn.page}
                                onChange={this.handleChange}
                                isInvalid={!!errors.page}
                                placeholder="Enter page number"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.page}
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                Can be a single page (e.g., "123") or a range (e.g., "123-124")
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={hymn.category}
                                onChange={this.handleChange}
                            >
                                <option value="hymn">Hymn</option>
                                <option value="childrens_song">Children's Song</option>
                                <option value="new_hymn">New Hymn</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        {isEditing ? 'Update' : 'Create'} Hymn
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

HymnForm.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    hymn: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        page: PropTypes.string,
        category: PropTypes.string
    }),
    isEditing: PropTypes.bool
};

export default HymnForm;
