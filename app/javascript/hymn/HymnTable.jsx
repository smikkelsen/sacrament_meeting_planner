import React from 'react';
import PropTypes from 'prop-types';
import {Table, Modal} from 'react-bootstrap';

class HymnTable extends React.Component {

    constructor(props) {
        super(props);
        this.handleHymnClick = this.handleHymnClick.bind(this);
        this.state = {
            showModal: false,
            // showCompleteTaskBtn: true,
            // showSnoozeTaskBtn: true,
            hymns: this.props.hymns,
            hymn: {
                name: null,
                page: null,
                category: null,
                id: null
            }
        };
    }


    handleHymnClick(hymn, e) {
            this.setState({showModal: true, hymn: {name: hymn.name, page: hymn.page, category: hymn.category, id: hymn.id}})
    }

    renderModal() {
        return (
            <Modal
                show={this.state.showModal}
                onHide={() => this.setState({showModal: false})}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.state.hymn.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/*<HymnDetail hymn_id={this.state.hymn.id}/>*/}
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        )
    }


    render() {
        return (
            <div>
                <Table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Page</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.hymns.map(hymn => (
                        <tr key={hymn.id} onClick={(e) => this.handleHymnClick(hymn, e)} >
                            <td>{hymn.name}</td>
                            <td>#{hymn.page}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                {this.renderModal()}
            </div>
        );
    }
}

export default HymnTable