import React from 'react';
import axios from 'axios';
import {Button, Panel, FormGroup, ControlLabel, FormControl, Col, PageHeader, Tabs, Tab, Table} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

/**
 * A counter button: tap the button to increase the count.
 */
class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomNumber: props.roomNumber,
            phoneNumber: props.phoneNumber,
            firstName: props.fName,
            lastName: props.lName,
            message: props.message,
            timestamp: props.timestamp,
            checkIn: props.checkIn,
            checkOut: props.checkOut
        };
        this.sendAlertUpdate = this.sendAlertUpdate.bind(this);
    } 

    componentWillReceiveProps(nextProps) {
        this.setState({roomNumber: nextProps.roomNumber}); 
        this.setState({phoneNumber: nextProps.phoneNumber}); 
        this.setState({firstName: nextProps.fName});
        this.setState({lastName: nextProps.lName});
        this.setState({message: nextProps.message});
        this.setState({timestamp: nextProps.timestamp});
        this.setState({checkIn: nextProps.checkIn});
        this.setState({checkOut: nextProps.checkOut});
    }

    sendAlertUpdate() {
        var _this = this;
        axios.post("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/reservations", {
            RoomNumber: this.state.roomNumber,
            PhoneNumber: this.state.phoneNumber,
            FName: this.state.firstName,
            LName: this.state.lastName,
            Message: this.state.message,
            CheckIn: this.state.checkIn,
            CheckOut: this.state.checkOut,
        }).then(function(response){
            console.log(response);
            var msg = 'Reservation was extended successfully. ' + _this.state.firstName + ' has been notified.';
            _this.props.showAlert(msg, 'success', 'check', '#19a745');
            _this.props.getReservationRequests();
        }).catch(function(error){
            console.log(error);
            var msg = "There was an error extending the reservation.";
            _this.props.showAlert(msg, 'error', 'times', '#E74C3C');
        })
    }

    render() {
        var startDate = (new Date(Number(this.state.checkIn))).toDateString();
        var newEndDate = (new Date(Number(this.state.checkOut))).toDateString();
        return (
            <tr className="resRow">
                <td>{this.state.roomNumber}</td>
                <td>{this.state.firstName} {this.state.lastName}</td>
                <td>{startDate}</td>
                <td>{newEndDate}</td>
                <td className="requestIcon" onClick={this.sendAlertUpdate}><FontAwesome name="check-circle-o" size="2x"/></td>
            </tr>
    );
  }
}

export default Reservation;