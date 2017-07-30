import React from 'react';
import axios from 'axios';
import {Button, Panel, FormGroup, ControlLabel, FormControl, Col, PageHeader, Tabs, Tab, Table} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

/**
 * A counter button: tap the button to increase the count.
 */
class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomNumber: props.roomNumber,
            firstName: props.fName,
            lastName: props.lName,
            message: props.message,
            phoneNumber: props.phoneNumber
        };
        this.sendAlertUpdate = this.sendAlertUpdate.bind(this);
    } 

    componentWillReceiveProps(nextProps) {
        this.setState({roomNumber: nextProps.roomNumber}); 
        this.setState({firstName: nextProps.fName});
        this.setState({lastName: nextProps.lName});
        this.setState({message: nextProps.message});
        this.setState({phoneNumber: nextProps.phoneNumber});
    }

    sendAlertUpdate() {
        var _this = this;
        axios.post("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/alerts", {
            RoomNumber: this.state.roomNumber,
            FName: this.state.firstName,
            LName: this.state.lastName,
            PhoneNumber: this.state.phoneNumber,
            Message: this.state.message
        }).then(function(response){
            var msg = 'Request was successful. ' + _this.state.firstName + ' has been notified.';
            _this.props.showAlert(msg, 'success', 'check', '#19a745');
            _this.props.getAlerts();
        }).catch(function(error){
            console.log(error);
            var msg = "There was an error sending the alert request.";
            _this.props.showAlert(msg, 'error', 'times', '#E74C3C');
        })
    }

    render() {
      return (
        <tr className="alertRow">
            <td>{this.state.roomNumber}</td>
            <td>{this.state.firstName} {this.state.lastName}</td>
            <td>{this.state.message}</td>
            <td className="requestIcon" onClick={this.sendAlertUpdate}><FontAwesome name="paper-plane"/></td>
        </tr>
    );
  }
}

export default Alert;