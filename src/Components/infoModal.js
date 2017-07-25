import React from 'react';
import axios from 'axios';
import {Button, Modal, Table} from 'react-bootstrap';
import _ from 'lodash';

class InfoModal extends React.Component {

    constructor() {
        super();
        this.state = {
            show: false,
            alexaId: "",
            roomInfo: {}
        };
        this.getRoomInformation = this.getRoomInformation.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({alexaId: nextProps.alexaId});
    }

    getRoomInformation() {
        var _this = this;
        if(this.state.alexaId !== ""){
            axios.get("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room?AlexaId=" + this.state.alexaId)
            .then(function(response){
                console.log(response.data);
                _this.setState({ roomInfo: response.data.data.Item });
                _this.setState({ show : true });
            }).catch(function(error){
                console.log(error);
                alert("There was an error retrieving the room information");
            })
        }
        else
            alert("Please enter an Alexa ID");
    }

    render(){
        let close = () => this.setState({ show: false });
        return (
            <div className="modal-container">
                <Button bsStyle="info" className="infoButton" onClick={this.getRoomInformation}>
                    Retrieve
                </Button>

                <Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">
                            Room #{this.state.roomInfo.RoomNumber}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone Number</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.roomInfo.FName} {this.state.roomInfo.LName}</td>
                                    <td>{this.state.roomInfo.PhoneNumber}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default InfoModal;