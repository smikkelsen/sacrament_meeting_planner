import React from 'react';
import PropTypes from 'prop-types';
import ProgramRow from './ProgramRow'

class ProgramRows extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            programs: this.props.programs,
            program: {
                meeting_type: null,
                date: null,
                presiding: null,
                conducting: null,
                chorister: null,
                organist: null,
                id: null
            }
        };
    }


    render() {
        return (
            <div id={'program-container'}>
                {this.state.programs.map(program => (
                   <ProgramRow key={program.id} currentUser={this.props.currentUser} program={program} users={this.props.users} hymns={this.props.hymns}/>
                ))}
            </div>
        );
    }
}

export default ProgramRows