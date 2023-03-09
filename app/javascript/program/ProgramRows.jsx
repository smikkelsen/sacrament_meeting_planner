import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import ProgramRow from './ProgramRow'
import {FilterCircle} from 'react-bootstrap-icons';
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {FloatingLabel} from "react-bootstrap";
import _ from "lodash";
import {fetchPrograms} from "../common/api";
import {scrollIntoViewWithOffset} from '../common/utils';


class ProgramRows extends React.Component {

    constructor(props) {
        super(props);
        this.renderFilterModal = this.renderFilterModal.bind(this);
        this.renderLoadMoreButton = this.renderLoadMoreButton.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClearFilter = this.handleClearFilter.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);

        this.state = {
            programs: this.props.programs,
            showFilterModal: false,
            filtered: false,
            searchType: 'all',
            searchValue: '',
            loadMore: {top: true, bottom: true}
        };
    }

    componentDidMount() {
        this.scrollToCurrent();
    }

    scrollToCurrent() {
        scrollIntoViewWithOffset("#current-program", 80)
    }

    handleSearch() {
        let params = {}
        if (this.state.searchType) {
            params['search_type'] = this.state.searchType
        }
        if (this.state.searchValue) {
            params['search_value'] = this.state.searchValue
        }
        fetchPrograms(params).then(
            (result) => {
                this.setState({
                    programs: result.programs,
                    filtered: true
                });
            },
            (error) => {
                console.log('failed to load programs');
                this.setState({
                    error: error
                });
            }
        );
    }

    handleClearFilter() {
        this.setState({
            searchType: '',
            searchValue: '',
            filtered: true
        }, this.handleSearch)
    }

    handleInputChange(e) {
        this.setState({[e.target.id]: e.target.value})
    }

    handleLoadMore(direction) {
        let params = {}
        let date = null
        if (direction === 'top') {
            date = this.state.programs.sort((a, b) => a.date - b.date)[0].date;
            console.log(date);
            params['end_date'] = date
        } else {
            date = this.state.programs.sort((a, b) => a.date - b.date).at(-1).date;
            console.log(date);
            params['start_date'] = date

        }

        fetchPrograms(params).then(
            (result) => {
                console.log(result)
                let newPrograms = result.programs.sort((a, b) => a.date - b.date);
                let loadMore = (newPrograms.length > 0);
                if (direction === 'top') {
                    newPrograms = newPrograms.concat(this.state.programs)
                } else {
                    newPrograms = this.state.programs.concat(newPrograms)
                }
                this.setState({
                    programs: newPrograms,
                    loadMore: {...this.state.loadMore, [direction]: loadMore}
                });
            },
            (error) => {
                console.log('failed to load programs');
                this.setState({
                    error: error
                });
            }
        );
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    renderLoadMoreButton(direction) {
        if (this.state.loadMore[direction]) {
            return (
                <Col className={'load-more-wrapper'} sm={12}>
                <Button variant={"secondary"}
                        onClick={(e) => this.handleLoadMore(direction)}>Load More</Button>
                </Col>
            )
        } else {
            return (
                <Col className={'load-more-wrapper'} sm={12}>
                <span>No more programs to load</span>
                </Col>
            )
        }

    }

    renderFilterModal() {
        return (
            <Modal
                show={this.state.showFilterModal}
                onHide={() => this.setState({showFilterModal: false})}
                size="md"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h3>Filters</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6} sm={12}>
                            <FloatingLabel label={'Search Type'} controlId={'searchType'}>
                                <Form.Select
                                    value={this.renderInputValue('searchType')}
                                    onChange={(e) => this.handleInputChange(e)}>
                                    <option value={'all'}>All</option>
                                    <option value={'speaker'}>Speakers</option>
                                    <option value={'prayer'}>Prayers</option>
                                    <option value={'release'}>Release</option>
                                    <option value={'sustaining'}>Sustaining</option>
                                    <option value={'musical_number'}>Musical Number</option>
                                    <option value={'program_other'}>Other Program</option>
                                    <option value={'announcement'}>Announcement</option>
                                    <option value={'notes'}>Notes</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                        <Col md={6} sm={12}>
                            <FloatingLabel label={'Search'}
                                           controlId={'searchValue'}>
                                <Form.Control
                                    value={this.renderInputValue('searchValue')}
                                    onChange={(e) => this.handleInputChange(e)}
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant={'secondary'} onClick={(e) => this.handleClearFilter()}>Clear Filter</Button>
                    <Button variant={"info"}
                            onClick={(e) => this.scrollToCurrent()}>
                        Go to Current Program
                    </Button>
                    <Button variant={'primary'} onClick={(e) => this.handleSearch()}>Search</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        return (
            <>
                {this.renderLoadMoreButton('top')}
                <div id={'program-container'}>
                    {this.state.programs.map(program => (
                        <ProgramRow key={program.id} currentUser={this.props.currentUser} program={program}
                                    users={this.props.users} hymns={this.props.hymns}/>
                    ))}
                </div>
                {this.renderLoadMoreButton('bottom')}

                {this.renderFilterModal()}
                <Button id={'open-filter-btn'} variant={"info"}
                        onClick={() => this.setState({showFilterModal: true})}>
                    <FilterCircle size={'2.5em'}/>
                </Button>
            </>
        );
    }
}

export default ProgramRows