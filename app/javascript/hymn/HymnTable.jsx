import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'react-bootstrap';

function HymnTable({ hymns, onEdit, onDelete, onSort, sortBy, sortDirection }) {
    const categoryDisplay = {
        'hymn': 'Hymn',
        'childrens_song': "Children's Song",
        'new_hymn': 'New Hymn'
    };

    const SortIcon = ({ field }) => {
        if (sortBy !== field) {
            return <span className="ms-1 text-muted">↕</span>;
        }
        return <span className="ms-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    const SortableHeader = ({ field, children }) => (
        <th onClick={() => onSort(field)} style={{ cursor: 'pointer', userSelect: 'none' }}>
            {children}
            <SortIcon field={field} />
        </th>
    );

    if (hymns.length === 0) {
        return (
            <div className="text-center text-muted py-5">
                <p>No hymns found. Click "Add New Hymn" to create one.</p>
            </div>
        );
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <SortableHeader field="name">Name</SortableHeader>
                    <SortableHeader field="page">Page</SortableHeader>
                    <SortableHeader field="category">Category</SortableHeader>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {hymns.map(hymn => (
                    <tr key={hymn.id}>
                        <td>{hymn.name}</td>
                        <td>#{hymn.page}</td>
                        <td>{categoryDisplay[hymn.category] || hymn.category}</td>
                        <td>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(hymn)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => onDelete(hymn.id)}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

HymnTable.propTypes = {
    hymns: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        page: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired
    })).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired
};

export default HymnTable;
