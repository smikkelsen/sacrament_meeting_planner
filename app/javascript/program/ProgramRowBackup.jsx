// import React from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Card from 'react-bootstrap/Card'
// import Badge from 'react-bootstrap/Badge'
// import {formatDateString, findArrayElementByAttribute} from '../common/utils.js';
// import {ChevronCompactDown, ChevronCompactUp, Trash3Fill} from 'react-bootstrap-icons';
// import {FloatingLabel} from "react-bootstrap";
// import ProgramItems from "./ProgramItems";
//
// const _ = require('lodash');
//
// // import {formatDateString, csrfToken} from '../common/utils.js';
// const USER_ROLES = {
//     admin: ['admin'],
//     bishopric: ['bishopric', 'bishop', 'admin'],
//     clerk: ['clerk', 'bishopric', 'bishop', 'admin'],
//     music: ['music', 'clerk', 'bishopric', 'bishop', 'admin']
// }
//
// class ProgramRow extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.handleExpand = this.handleExpand.bind(this);
//         this.handleCollapse = this.handleCollapse.bind(this);
//         this.handleEdit = this.handleEdit.bind(this);
//         this.handleInputChange = this.handleInputChange.bind(this);
//         this.handleNestedObjChange = this.handleNestedObjChange.bind(this);
//         this.handleProgramItemChange = this.handleProgramItemChange.bind(this);
//         this.hasRole = this.hasRole.bind(this);
//         this.addProgramItemToForm = this.addProgramItemToForm.bind(this);
//         this.removeProgramItemFromForm = this.removeProgramItemFromForm.bind(this);
//         this.renderInputValue = this.renderInputValue.bind(this);
//         this.renderModal = this.renderModal.bind(this);
//         this.renderProgramItemForm = this.renderProgramItemForm.bind(this);
//         this.renderProgramNotes = this.renderProgramNotes.bind(this);
//         this.renderMeetingType = this.renderMeetingType.bind(this);
//         this.renderUserSelect = this.renderUserSelect.bind(this);
//         this.renderHymnSelect = this.renderHymnSelect.bind(this);
//         this.renderHymn = this.renderHymn.bind(this);
//         this.renderPerson = this.renderPerson.bind(this);
//         this.renderSpeakersNeeded = this.renderSpeakersNeeded.bind(this);
//         this.renderMusicNeeded = this.renderMusicNeeded.bind(this);
//         this.renderPrayersNeeded = this.renderPrayersNeeded.bind(this);
//         this.state = {
//             showEditModal: false,
//             expanded: false,
//             program: this.props.program,
//             users: this.props.users,
//             hymns: this.props.hymns
//         };
//     }
//
//     handleEdit(_e) {
//         this.setState({showEditModal: true})
//     }
//
//     handleExpand(_e) {
//         if(this.state.expanded) {
//             if(event.target.classList.contains('collapsable')) {
//                 this.setState({expanded: false})
//             }
//         } else {
//             this.setState({expanded: true})
//         }
//     }
//
//     handleCollapse(_e) {
//         if (this.state.expanded) {
//             this.setState({expanded: false})
//         }
//     }
//
//     handleInputChange(e) {
//         this.setState(prevState => {
//             return {program: {...prevState.program, [e.target.id]: e.target.value}}
//         })
//     }
//
//     handleNestedObjChange(array, nestedKey, e) {
//         let obj = findArrayElementByAttribute(array, e.target.value, 'id');
//         if (obj === undefined) {
//             obj = {...this.state.program[nestedKey]}
//             Object.keys(obj).forEach(function (index) {
//                 obj[index] = null
//             });
//         }
//         this.setState(prevState => {
//             return {program: {...prevState.program, [nestedKey]: obj}}
//         })
//     }
//
//     hasRole(role) {
//         return (
//             USER_ROLES[role].includes(this.props.currentUser.role)
//         )
//     }
//
//     renderInputValue(attributeId) {
//         let val = _.get(this.state.program, attributeId)
//         if (val) {
//             return (val)
//         } else {
//             return ('')
//         }
//     }
//
//     renderUserSelect(label, userType, userTypeFilter, role) {
//         let attributeId = `${userType}.id`
//         return (
//             <FloatingLabel label={label} controlId={attributeId}>
//                 <Form.Select value={this.renderInputValue(attributeId)}
//                              onChange={(e) => this.handleNestedObjChange(this.props.users, userType, e)}
//                              disabled={!this.hasRole(role)}>
//                     <option></option>
//                     {this.props.users.filter(function (u) {
//                         return u[userTypeFilter] === true
//                     }).map(user => (
//                         <option key={user.id} value={user.id}>{user.full_name}</option>
//                     ))}
//                 </Form.Select>
//             </FloatingLabel>
//         )
//     }
//
//     renderHymnSelect(label, hymnType, role) {
//         let attributeId = `${hymnType}.id`
//         return (
//             <FloatingLabel label={label} controlId={attributeId}>
//                 <Form.Select
//                     id={attributeId}
//                     value={this.renderInputValue(attributeId)}
//                     onChange={(e) => this.handleNestedObjChange(this.props.hymns, hymnType, e)}
//                     disabled={!this.hasRole(role)}>
//                     <option></option>
//                     {this.state.hymns.map(hymn => (
//                         <option key={hymn.id} value={hymn.id}>#{hymn.page} {hymn.name}</option>
//                     ))}
//                 </Form.Select>
//             </FloatingLabel>
//         )
//     }
//
//     renderMeetingType(meetingType, prefix = '') {
//         return ((meetingType === 'standard') ? '' : `${prefix}${_.startCase(meetingType)}`)
//     }
//
//     addProgramItemToForm(itemType = null) {
//         this.setState(prevState => {
//             return {
//                 program: {
//                     ...prevState.program,
//                     program_items: this.state.program.program_items.concat({
//                         id: -(Math.floor(Math.random() * 1000000000)),
//                         item_type: itemType,
//                         key: null,
//                         value: null,
//                         program_id: this.state.program.id
//                     })
//                 }
//             }
//         })
//     }
//
//     removeProgramItemFromForm(id) {
//         this.handleProgramItemChange(id, 'delete', true)
//     }
//
//     handleProgramItemChange(id, key, value) {
//         this.setState(prevState => {
//             return {
//                 program: {
//                     ...prevState.program,
//                     program_items: this.state.program.program_items.map(pi => (
//                         pi.id === id ? Object.assign({}, pi, {[key]: value}) : pi))
//                 }
//             }
//         })
//     }
//
//     renderProgramItemForm(itemTypes) {
//         let itemInputs = [];
//         this.state.program.program_items.forEach((item, index) => {
//             if (!itemTypes.includes(item.item_type)) {
//                 return;
//             }
//             if (item.delete) {
//                 return;
//             }
//
//             let itemTypeId = `program_items[${index}].item_type`
//             let keyId = `program_items[${index}].key`
//             let valueId = `program_items[${index}].value`
//             switch (item.item_type) {
//                 case 'speaker':
//                     itemInputs.push(
//                         <Row className={'input-row'} key={index}>
//                             <h6>Speaker</h6>
//                             <Col md={6} sm={12}>
//                                 <InputGroup>
//                                     <Form.Control
//                                         id={keyId}
//                                         placeholder={'Speaker'}
//                                         value={this.renderInputValue(keyId)}
//                                         onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
//                                         disabled={!this.hasRole('bishopric')}/>
//                                 </InputGroup>
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 <InputGroup>
//                                     <Form.Control
//                                         placeholder={'Topic'}
//                                         id={valueId}
//                                         value={this.renderInputValue(valueId)}
//                                         onChange={(e) => this.handleProgramItemChange(item.id, 'value', e.target.value)}
//                                         disabled={!this.hasRole('bishopric')}/>
//                                     <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
//                                             disabled={!this.hasRole('bishopric')}
//                                             variant={'danger'}><Trash3Fill/></Button>
//                                 </InputGroup>
//                             </Col>
//                         </Row>
//                     );
//                     break;
//                 case 'musical_number':
//                     itemInputs.push(
//                         <Row className={'input-row'} key={index}>
//                             <h6>Musical Number</h6>
//                             <Col sm={12}>
//                                 <InputGroup>
//                                     <Form.Control
//                                         id={valueId}
//                                         placeholder={'Title'}
//                                         value={this.renderInputValue(valueId)}
//                                         onChange={(e) => this.handleProgramItemChange(item.id, 'value', e.target.value)}
//                                         disabled={!this.hasRole('bishopric')}/>
//                                     <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
//                                             disabled={!this.hasRole('bishopric')}
//                                             variant={'danger'}><Trash3Fill/></Button>
//                                 </InputGroup>
//                             </Col>
//
//                         </Row>
//                     );
//                     break;
//                 case 'program_other':
//                     itemInputs.push(
//                         <Row className={'input-row'} key={index}>
//                             <h6>Other</h6>
//                             <Col md={6} sm={12}>
//                                 <InputGroup>
//                                     <Form.Control
//                                         id={keyId}
//                                         placeholder={'Title'}
//                                         value={this.renderInputValue(keyId)}
//                                         onChange={(e) => this.handleProgramItemChange(item.id, 'key', e.target.value)}
//                                         disabled={!this.hasRole('bishopric')}/>
//                                 </InputGroup>
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 <InputGroup>
//                                     <Form.Control
//                                         id={valueId}
//                                         placeholder={'Value'}
//                                         value={this.renderInputValue(valueId)}
//                                         onChange={(e) => this.handleProgramItemChange(item.id, 'value', e.target.value)}
//                                         disabled={!this.hasRole('bishopric')}/>
//                                     <Button onClick={(_e) => this.removeProgramItemFromForm(item.id)}
//                                             disabled={!this.hasRole('bishopric')}
//                                             variant={'danger'}><Trash3Fill/></Button>
//                                 </InputGroup>
//                             </Col>
//
//                         </Row>
//                     );
//                     break;
//                 case 'program_new':
//                     itemInputs.push(
//                         <Row className={'input-row'} key={index}>
//                             <Col sm={12}>
//                                 <InputGroup>
//                                     <Form.Select
//                                         id={itemTypeId}
//                                         onChange={(e) => this.handleProgramItemChange(item.id, 'item_type', e.target.value)}
//                                         value={this.renderInputValue(itemTypeId)}>
//                                         <option value={'program_new'}>Choose Type</option>
//                                         <option value={'speaker'}>Speaker</option>
//                                         <option value={'musical_number'}>Musical Number</option>
//                                         <option value={'program_other'}>Other</option>
//                                     </Form.Select>
//                                     <Button
//                                         onClick={(_e) => this.removeProgramItemFromForm(item.id)}
//                                         variant={'danger'}><Trash3Fill/></Button>
//                                 </InputGroup>
//                             </Col>
//                         </Row>
//                     );
//                     break;
//             }
//         })
//         return (
//             <>
//                 {itemInputs}
//                 <Button onClick={(_e) => this.addProgramItemToForm('program_new')}
//                         disabled={!this.hasRole('bishopric')}>Add Program Item</Button>
//             </>
//         )
//     }
//
//     renderModal() {
//         const {program} = this.state;
//         return (
//             <Modal
//                 show={this.state.showEditModal}
//                 onHide={() => this.setState({showEditModal: false})}
//                 size="lg"
//             >
//                 <Modal.Header closeButton>
//                     <Modal.Title>
//                         {formatDateString(program.date, 'MMM do yyyy')}
//                         {this.renderMeetingType(program.meeting_type, ' - ')}
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <FloatingLabel className={'input-row'} label={'Meeting Type'} controlId={'meeting_type'}>
//                             <Form.Select
//                                 value={this.renderInputValue('meeting_type')}
//                                 onChange={(e) => this.handleInputChange(e)}
//                                 disabled={!this.hasRole('clerk')}>
//                                 <option value={'standard'}>Standard</option>
//                                 <option value={'fast_sunday'}>Fast Sunday</option>
//                                 <option value={'ward_conference'}>Ward Conference</option>
//                                 <option value={'stake_conference'}>Stake Conference</option>
//                                 <option value={'general_conference'}>General Conference</option>
//                             </Form.Select>
//                         </FloatingLabel>
//                         <Row className={'input-row'}>
//                             <Col md={6} sm={12}>
//                                 {this.renderUserSelect('Sacrament Meeting Prep', 'prep', 'prepper', 'bishopric')}
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 {this.renderUserSelect('Conducting', 'conducting', 'conductor', 'clerk')}
//                             </Col>
//                         </Row>
//                         <hr/>
//                         <Row className={'input-row'}>
//                             <Col md={6} sm={12}>
//                                 {this.renderUserSelect('Organist', 'organist', 'organist', 'music')}
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 {this.renderUserSelect('Chorister', 'chorister', 'chorister', 'music')}
//                             </Col>
//                         </Row>
//                         <Row className={'input-row'}>
//                             <Col md={6} sm={12}>
//                                 {this.renderHymnSelect('Opening Hymn', 'opening_hymn', 'music')}
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 {this.renderHymnSelect('Sacrament Hymn', 'sacrament_hymn', 'music')}
//                             </Col>
//                         </Row>
//                         <Row className={'input-row'}>
//                             <Col md={6} sm={12}>
//                                 {this.renderHymnSelect('Intermediate Hymn', 'intermediate_hymn', 'music')}
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 {this.renderHymnSelect('Closing Hymn', 'closing_hymn', 'music')}
//                             </Col>
//                         </Row>
//                         <hr/>
//                         <Row className={'input-row'}>
//                             <Col md={6} sm={12}>
//                                 <FloatingLabel className={'input-row'} label={'Opening Prayer'}
//                                                controlId={'opening_prayer'}>
//                                     <Form.Control
//                                         value={this.renderInputValue('opening_prayer')}
//                                         onChange={(e) => this.handleInputChange(e)}
//                                         disabled={!this.hasRole('clerk')}/>
//                                 </FloatingLabel>
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 <FloatingLabel className={'input-row'} label={'Closing Prayer'}
//                                                controlId={'closing_prayer'}>
//                                     <Form.Control
//                                         value={this.renderInputValue('closing_prayer')}
//                                         onChange={(e) => this.handleInputChange(e)}
//                                         disabled={!this.hasRole('clerk')}/>
//                                 </FloatingLabel>
//                             </Col>
//                         </Row>
//                         <hr/>
//                         <h4>Program</h4>
//                         {this.renderProgramItemForm(['speaker', 'musical_number', 'program_other', 'program_new'])}
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                 </Modal.Footer>
//             </Modal>
//         )
//     }
//
//     renderHymn(hymn) {
//         if (hymn.name) {
//             return (`#${hymn.page} - ${hymn.name}`)
//         } else {
//             return ('')
//         }
//     }
//
//     renderPerson(person) {
//         if (person.full_name) {
//             return (person.full_name)
//         } else {
//             return ('')
//         }
//     }
//
//     renderProgramNotes(notes) {
//         if (notes) {
//             return (
//                 <Col sm={12}>
//                     <Card className={'notes'}>
//                         <Card.Body>
//                             <Card.Title>Notes</Card.Title>
//                             <div>{notes}</div>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             )
//         } else {
//             return ('')
//         }
//     }
//
//     renderMusicNeeded(program) {
//         return (
//             !((program.chorister.id && program.organist.id && program.opening_hymn.id && program.sacrament_hymn.id && program.closing_hymn.id) ||
//                 ['stake_conference', 'general_conference'].includes(program.meeting_type)) ?
//                 <Badge pill bg={'warning'}>Music Needed</Badge> : ''
//         )
//     }
//
//     renderPrayersNeeded(program) {
//         return (
//             !((program.opening_prayer && program.closing_prayer) || ['stake_conference', 'general_conference'].includes(program.meeting_type)) ?
//                 <Badge pill bg={'warning'}>Prayers Needed</Badge> : ''
//         )
//     }
//
//     renderSpeakersNeeded(program) {
//         return (
//             !(
//                 (program.program_items.filter(i => ((i.item_type === 'speaker') && i.key)).length > 1) ||
//                 ['fast_sunday', 'stake_conference', 'general_conference'].includes(program.meeting_type)) ?
//                 <Badge pill bg="danger">Speakers Needed</Badge> : ''
//         )
//     }
//
//
//     render() {
//         const {program} = this.state;
//         let renderParentClickable = `collapsable ${this.state.expanded ? 'parent-clickable' : ''}`;
//         let intermediateHymn = '';
//         if (program.intermediate_hymn.id) {
//             intermediateHymn = <div><span
//                 className={'item-label'}>Intermediate Hymn:</span> {this.renderHymn(program.intermediate_hymn)}</div>
//         }
//         return (
//             <Card key={program.id} className={`program-row ${this.state.expanded ? 'expanded' : 'collapsed no-focus clickable'}`} onClick={(e) => this.handleExpand(e)}>
//                 <Card.Body>
//                     <Row>
//                         <Col md={3} className={renderParentClickable}>
//                             <Row>
//                                 <Col sm={12}>
//                                     <div
//                                         className={'date col-sm-12 col-md-auto '}>{formatDateString(program.date, 'MMM do')}</div>
//                                     <div className={'meeting-type text-info col-sm-12 col-md-auto'}>
//                                         {this.renderMeetingType(program.meeting_type)}
//                                     </div>
//                                 </Col>
//                                 <Col sm={12}>
//                                     <span
//                                         className={'sacrament-prep text-secondary'}>Prep: {program.prep.full_name}</span>
//                                 </Col>
//                                 <Col sm={12}>
//                                     <span
//                                         className={'conducting text-secondary'}>Conduct: {program.conducting.full_name}</span>
//                                 </Col>
//                             </Row>
//                             <Row>
//                                 <Col sm={12}>
//                                     {this.renderSpeakersNeeded(program)}
//                                     {this.renderPrayersNeeded(program)}
//                                     {this.renderMusicNeeded(program)}
//                                 </Col>
//                             </Row>
//                         </Col>
//                         <Col md={9} className={renderParentClickable}>
//                             <Row>
//                                 <Col md={6} className={renderParentClickable}>
//                                     <ProgramItems cardTitle={'Program'} programItems={program.program_items} itemTypes={['speaker', 'musical_number', 'program_other']} />
//                                     <Col sm={12}>
//                                         <Card className={'prayers'}>
//                                             <Card.Body>
//                                                 <Card.Title>Prayers</Card.Title>
//                                                 <div><span
//                                                     className={'item-label'}>Opening:</span> {program.opening_prayer}
//                                                 </div>
//                                                 <div><span
//                                                     className={'item-label'}>Closing:</span> {program.closing_prayer}
//                                                 </div>
//                                             </Card.Body>
//                                         </Card>
//                                     </Col>
//                                     {this.renderProgramNotes(program.notes)}
//                                 </Col>
//                                 <Col md={6} className={renderParentClickable}>
//                                     <Col sm={12}>
//                                         <Card className={'music'}>
//                                             <Card.Body>
//                                                 <Card.Title>Music</Card.Title>
//                                                 <div><span
//                                                     className={'item-label'}>Chorister:</span> {program.chorister.full_name}
//                                                 </div>
//                                                 <div><span
//                                                     className={'item-label'}>Organist:</span> {program.organist.full_name}
//                                                 </div>
//                                                 <div><span
//                                                     className={'item-label'}>Opening Hymn:</span> {this.renderHymn(program.opening_hymn)}
//                                                 </div>
//                                                 <div><span
//                                                     className={'item-label'}>Sacrament Hymn:</span> {this.renderHymn(program.sacrament_hymn)}
//                                                 </div>
//                                                 {intermediateHymn}
//                                                 <div><span
//                                                     className={'item-label'}>Closing Hymn:</span> {this.renderHymn(program.closing_hymn)}
//                                                 </div>
//                                             </Card.Body>
//                                         </Card>
//                                     </Col>
//                                     <ProgramItems cardTitle={'Announcements'} programItems={program.program_items} itemTypes={['announcements']} />
//                                     <ProgramItems cardTitle={'Sustainings'} programItems={program.program_items} itemTypes={['sustaining']} />
//                                     <ProgramItems cardTitle={'Releases'} programItems={program.program_items} itemTypes={['release']} />
//                                 </Col>
//                             </Row>
//                         </Col>
//                     </Row>
//                     <Row>
//                         <Col sm={6} className={renderParentClickable}>
//                             <Button onClick={(e) => this.handleEdit(e)}>Edit</Button>
//                         </Col>
//                         <Col sm={6} className={`${renderParentClickable} text-end`}>
//                             {this.state.expanded ? <ChevronCompactUp/> : <ChevronCompactDown/>}
//                         </Col>
//                         {this.renderModal()}
//                     </Row>
//                 </Card.Body>
//             </Card>
//         );
//     }
// }
//
// export default ProgramRow