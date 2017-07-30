import React from 'react';
import axios from 'axios';
import {Button, Modal, Table} from 'react-bootstrap';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';

class InfoModal extends React.Component {

    constructor() {
        super();
        this.state = {
            show: false,
            alexaId: "",
            roomNumber: "",
            roomInfo: {}
        };
        this.getRoomInformation = this.getRoomInformation.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({roomNumber: nextProps.roomNumber});
    }

    getRoomInformation() {
        var _this = this;
        if(this.state.roomNumber !== ""){
            axios.get("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room?RoomNumber=" + this.state.roomNumber)
            .then(function(response){
                if(response.data !== null){
                    _this.setState({ roomInfo: response.data });
                    _this.setState({ show : true });
                }
                else{
                    var msg = "The room you requested does not exist";
                    _this.props.showAlert(msg, 'error', 'times', '#E74C3C');
                }
            }).catch(function(error){
                console.log(error);
                var msg = "There was an error retrieving room information.";
                _this.props.showAlert(msg, 'error', 'times', '#E74C3C');
            })
        }
        else{
            var msg = "Please enter a room number";
            _this.props.showAlert(msg, 'error', 'warning', '#e4de12');
        }
            
    }

    render(){
        let close = () => this.setState({ show: false });

        if(this.state.roomInfo !== null && this.state.roomInfo !== undefined){
            var roomNum =  this.state.roomInfo.RoomNumber;
            var firstName = this.state.roomInfo.FName;
            var lastName = this.state.roomInfo.LName;
            var phone = this.state.roomInfo.PhoneNumber;
        }

        return (
            <div className="modal-container">
                <Button bsStyle="info" className="infoButton" onClick={this.getRoomInformation}>
                    Retrieve
                </Button>
                
                <Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">
                            Room #{roomNum}
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
                                    <td>{firstName} {lastName}</td>
                                    <td>{phone}</td>
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