import React from 'react';
import PropTypes from 'prop-types';
import { Button, Alert, Container, Form, Row, Col } from 'react-bootstrap';
import HymnTable from './HymnTable';
import HymnForm from './HymnForm';
import { fetchHymns, upsertHymn, destroyHymn } from '../common/api';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            hymns: [],
            filteredHymns: [],
            showForm: false,
            editingHymn: null,
            successMessage: null,
            searchQuery: '',
            categoryFilter: 'all',
            sortBy: 'page',
            sortDirection: 'asc'
        };
        this.handleAddNew = this.handleAddNew.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCloseForm = this.handleCloseForm.bind(this);
        this.loadHymns = this.loadHymns.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCategoryFilter = this.handleCategoryFilter.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.filterAndSortHymns = this.filterAndSortHymns.bind(this);
    }

    loadHymns() {
        fetchHymns()
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        hymns: result.hymns
                    }, () => {
                        this.filterAndSortHymns();
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: { message: error.message || 'Failed to load hymns' }
                    });
                }
            );
    }

    componentDidMount() {
        this.loadHymns();
    }

    filterAndSortHymns() {
        const { hymns, searchQuery, categoryFilter, sortBy, sortDirection } = this.state;

        let filtered = [...hymns];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(hymn =>
                hymn.name.toLowerCase().includes(query) ||
                hymn.page.toString().includes(query)
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(hymn => hymn.category === categoryFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            // Convert page numbers for numeric sorting if sorting by page
            if (sortBy === 'page') {
                aVal = parseInt(aVal) || 0;
                bVal = parseInt(bVal) || 0;
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.setState({ filteredHymns: filtered });
    }

    handleSearch(e) {
        this.setState({ searchQuery: e.target.value }, () => {
            this.filterAndSortHymns();
        });
    }

    handleCategoryFilter(e) {
        this.setState({ categoryFilter: e.target.value }, () => {
            this.filterAndSortHymns();
        });
    }

    handleSort(field) {
        this.setState(prevState => ({
            sortBy: field,
            sortDirection: prevState.sortBy === field && prevState.sortDirection === 'asc' ? 'desc' : 'asc'
        }), () => {
            this.filterAndSortHymns();
        });
    }

    handleAddNew() {
        this.setState({
            showForm: true,
            editingHymn: null,
            error: null
        });
    }

    handleEdit(hymn) {
        this.setState({
            showForm: true,
            editingHymn: hymn,
            error: null
        });
    }

    handleDelete(hymnId) {
        if (!window.confirm('Are you sure you want to delete this hymn?')) {
            return;
        }

        destroyHymn(hymnId)
            .then(() => {
                this.setState({
                    successMessage: 'Hymn deleted successfully',
                    error: null
                });
                this.loadHymns();
                setTimeout(() => {
                    this.setState({ successMessage: null });
                }, 3000);
            })
            .catch((error) => {
                this.setState({
                    error: { message: error.message || 'Failed to delete hymn' },
                    successMessage: null
                });
            });
    }

    handleSave(hymnData) {
        upsertHymn(hymnData)
            .then((result) => {
                if (result.errors) {
                    this.setState({
                        error: { message: result.errors.join(', ') }
                    });
                } else {
                    this.setState({
                        showForm: false,
                        editingHymn: null,
                        successMessage: hymnData.id ? 'Hymn updated successfully' : 'Hymn created successfully',
                        error: null
                    });
                    this.loadHymns();
                    setTimeout(() => {
                        this.setState({ successMessage: null });
                    }, 3000);
                }
            })
            .catch((error) => {
                this.setState({
                    error: { message: error.message || 'Failed to save hymn' }
                });
            });
    }

    handleCloseForm() {
        this.setState({
            showForm: false,
            editingHymn: null,
            error: null
        });
    }

    render() {
        const { error, isLoaded, filteredHymns, showForm, editingHymn, successMessage, searchQuery, categoryFilter, sortBy, sortDirection } = this.state;

        if (!isLoaded) {
            return (
                <Container className="mt-4">
                    <div className="text-center">Loading...</div>
                </Container>
            );
        }

        return (
            <Container className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Hymn Management</h2>
                    <Button variant="primary" onClick={this.handleAddNew}>
                        Add New Hymn
                    </Button>
                </div>

                {error && (
                    <Alert variant="danger" dismissible onClose={() => this.setState({ error: null })}>
                        {error.message}
                    </Alert>
                )}

                {successMessage && (
                    <Alert variant="success" dismissible onClose={() => this.setState({ successMessage: null })}>
                        {successMessage}
                    </Alert>
                )}

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            placeholder="Search by name or page number..."
                            value={searchQuery}
                            onChange={this.handleSearch}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Select value={categoryFilter} onChange={this.handleCategoryFilter}>
                            <option value="all">All Categories</option>
                            <option value="hymn">Hymns</option>
                            <option value="childrens_song">Children's Songs</option>
                            <option value="new_hymn">New Hymns</option>
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <div className="text-muted">
                            {filteredHymns.length} hymn{filteredHymns.length !== 1 ? 's' : ''} found
                        </div>
                    </Col>
                </Row>

                <HymnTable
                    hymns={filteredHymns}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    onSort={this.handleSort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                />

                <HymnForm
                    show={showForm}
                    onHide={this.handleCloseForm}
                    onSave={this.handleSave}
                    hymn={editingHymn}
                    isEditing={!!editingHymn}
                />
            </Container>
        );
    }
}

export default App
