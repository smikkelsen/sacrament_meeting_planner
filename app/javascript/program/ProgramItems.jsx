import React from 'react';
import {Col, Card} from "react-bootstrap";

class ProgramItems extends React.Component {

    constructor(props) {
        super(props);
    }

    renderProgramItem(item, itemTypes) {
        let itemText = '';
        if (!itemTypes.includes(item.item_type) || item._destroy) {
            return (itemText);
        }
        let key = item.key
        let value = item.value ? ` - ${item.value}` : ''
        switch (item.item_type) {
            case 'speaker':
                itemText = <div key={item.id}><span className={'item-label'}>Speaker:</span> {key}{value}</div>
                break;
            case 'intermediate_hymn':
                itemText =
                    <div key={item.id}><span className={'item-label'}>Intermediate Hymn:</span> {this.props.intermediateHymnText}</div>
                break;
            case 'musical_number':
                itemText =
                    <div key={item.id}><span className={'item-label'}>Musical Number:</span> {key}{value}</div>
                break;
            case 'program_other':
                itemText = <div key={item.id}><span className={'item-label'}></span> {key}{value}</div>
                break;
            case 'announcement':
                itemText = <div key={item.id}><span className={'item-label'}></span> {key}{value}</div>
                break;
            case 'sustaining':
                itemText = <div key={item.id}><span className={'item-label'}></span> {key}{value}</div>
                break;
            case 'release':
                itemText = <div key={item.id}><span className={'item-label'}></span> {key}{value}</div>
                break;
            case 'business':
                itemText = <div key={item.id}><span className={'item-label'}></span> {key}{value}</div>
                break;
        }
        return (itemText)
    }

    render() {
        const {cardTitle, itemTypes, programItems} = this.props;
        let items = programItems.filter(function (i) {
            return itemTypes.includes(i.item_type)
        })
        if (items.length > 0) {
            return (
                <Col sm={12}><Card className={cardTitle.toLowerCase()}><Card.Body>
                    <Card.Title>{cardTitle}</Card.Title>
                    {items.map(item => (
                        this.renderProgramItem(item, itemTypes)
                    ))}
                </Card.Body></Card></Col>
            );
        } else {
            return ('');
        }
    }

}

export default ProgramItems
