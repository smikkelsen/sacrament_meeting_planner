import React from 'react';
import PropTypes from 'prop-types';
import {Table, Row, Col, Form, FloatingLabel} from 'react-bootstrap';
import {fetchPrograms} from "../common/api";
import {formatDateTimeString, startOfMonth, endOfMonth, startOfYear, endOfYear} from "../common/date";
import _ from "lodash";

class HymnReport extends React.Component {

    constructor(props) {
        super(props);
        this.renderInputValue = this.renderInputValue.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            programs: []
        };
    }

    handleInputChange(e) {
        this.setState({[e.target.id]: e.target.value})
    }

    renderInputValue(attributeId) {
        let val = _.get(this.state, attributeId)
        if (val) {
            return (val)
        } else {
            return ('')
        }
    }

    handleSearch(e) {
        let dateRange = e.target.value
        let startDate = '';
        let endDate = '';
        let perPage = 150;
        switch (dateRange) {
            case 'current_month':
                startDate = startOfMonth().toISOString();
                endDate = endOfMonth().toISOString();
                break;
            case 'next_month':
                startDate = startOfMonth(1).toISOString();
                endDate = endOfMonth(1).toISOString();
                break;
            case 'last_month':
                startDate = startOfMonth(-1).toISOString();
                endDate = endOfMonth(-1).toISOString();
                break;
            case 'current_year':
                startDate = startOfYear().toISOString();
                endDate = endOfYear().toISOString();
                break;
            case 'next_year':
                startDate = startOfYear(1).toISOString();
                endDate = endOfYear(1).toISOString();
                break;
            case 'last_year':
                startDate = startOfYear(-1).toISOString();
                endDate = endOfYear(-1).toISOString();
                break;
            case '':
                return (null);
        }
        fetchPrograms({per_page: perPage, start_date: startDate, end_date: endDate}).then(
            (result) => {
                this.setState({
                    programs: result.programs,
                    dateRange: dateRange
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

    componentDidMount() {

    }

    renderHymnString(hymn) {
        if (hymn.page) {
            return (<span>#{hymn.page} {hymn.name}</span>)
        } else {
            return ('')
        }
    }

    renderSearch() {
        return (
            <Col sm={12}>
                <FloatingLabel label={'Date Range'} controlId={'dateRange'}>
                    <Form.Select
                        value={this.renderInputValue('dateRange')}
                        onChange={(e) => this.handleSearch(e)}>
                        <option value={''}>Choose Date Range</option>
                        <option value={'current_month'}>This Month</option>
                        <option value={'next_month'}>Next Month</option>
                        <option value={'last_month'}>Last Month</option>
                        <option value={'current_year'}>This Year</option>
                        <option value={'next_year'}>Next Year</option>
                        <option value={'last_year'}>Last Year</option>
                    </Form.Select>
                </FloatingLabel>
            </Col>
        )
    }

    renderTable() {
        if (this.state.programs) {
            return (
                <Table className={'table-striped'}>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Organist</th>
                        <th>Chorister</th>
                        <th>Opening Hymn</th>
                        <th>Sacrament Hymn</th>
                        <th>Intermediate Hymn</th>
                        <th>Closing Hymn</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.programs.map(program => (
                        <tr key={program.id}>
                            <td>{formatDateTimeString(program.date, 'MMM do yyyy')}</td>
                            <td>{program.organist.full_name}</td>
                            <td>{program.chorister.full_name}</td>
                            <td>{this.renderHymnString(program.opening_hymn)}</td>
                            <td>{this.renderHymnString(program.sacrament_hymn)}</td>
                            <td>{this.renderHymnString(program.intermediate_hymn)}</td>
                            <td>{this.renderHymnString(program.closing_hymn)}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            );
        } else {
            return (<div></div>);
        }

    }

    render() {
        return (
            <div>
                <Row>
                    {this.renderSearch()}
                </Row>
                <Row>
                    {this.renderTable()}
                </Row>
            </div>
        )
    }
}

export default HymnReport