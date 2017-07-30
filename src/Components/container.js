import React from 'react';
import axios from 'axios';
import css from '../styles/Container.css';
import InfoModal from './infoModal';
import Alert from './alert';
import {Button, Panel, FormGroup, ControlLabel, FormControl, Col, PageHeader, Tabs, Tab, Table} from 'react-bootstrap';
import _ from 'lodash';
import AlertContainer from 'react-alert';
import FontAwesome from 'react-fontawesome';
/**
 * A counter button: tap the button to increase the count.
 */
class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      alexaId: "",
      roomNumber: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      alertsArr: []
    };
    this.updateRoomInformation = this.updateRoomInformation.bind(this);
    this.getAlerts = this.getAlerts.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.clearState = this.clearState.bind(this);

    this.alertOptions = {
      offset: 14,
      position: 'top left',
      theme: 'dark',
      transition: 'scale'
    }
  }

  getAlerts() {
    var _this = this;
    axios.get("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/alerts?isActive=1")
    .then(function(response){
      _this.setState({alertsArr: response.data});
    }).catch(function(error){
      console.log(error);
    })
  }

  showAlert(msg, type, img, color) {
    var _this = this;
    _this.msg.show(msg, {
      time: 5000,
      type: type,
      icon: <FontAwesome size="3x" name={img} style={{ color: color }}/>
    })
  }

  clearState() {
    this.setState({alexaId: ""});
    this.setState({roomNumber: ""});
    this.setState({firstName: ""});
    this.setState({lastName: ""});
    this.setState({phoneNumber: ""});
  }

  updateRoomInformation() {
    var _this = this;
    axios.post("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room", {
      RoomNumber: this.state.roomNumber,
      FName: this.state.firstName,
      LName: this.state.lastName,
      PhoneNumber: this.state.phoneNumber
    }).then(function(response){
      console.log(response.data);
      var msg = 'The room was updated successfully with ' + _this.state.firstName + ' ' + _this.state.lastName;
      _this.showAlert(msg, 'success', 'check', '#19a745');
      _this.clearState();
    }).catch(function(error){
      console.log(error);
      var msg = "There was an issue updating the room.";
      _this.showAlert(msg, 'error', 'times', '#E74C3C');
    })
  }

  updateFormValue(fieldName, evt) {
    var obj = {};
    obj[fieldName] = evt.target.value;
    this.setState(obj);
  }
 
  render() {
    const title = (
      <h2>Guest Registration</h2>
    );
    var registrationFooter = (
      <Button bsStyle="success" className="registerButton" onClick={this.updateRoomInformation}>
        Register
      </Button>
    );
    var informationFooter = (
      <InfoModal roomNumber={this.state.roomNumber} showAlert={this.showAlert}/>
    );

    var alerts = this.state.alertsArr;

    return (

      <div className={'container'} style={{width: '600px'}}>

        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />

        <PageHeader>Suite Service <small>Registration Portal</small></PageHeader>

        <Tabs bsStyle="pills" defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Guest Registration"> <br/>
            <Panel bsStyle="info" footer={registrationFooter}>

              <FormGroup controlId="roomID" validationState={null}>
                <Col md={12}>
                  <ControlLabel>Room Number</ControlLabel>
                  <FormControl type="text" value={this.state.roomNumber} onChange={this.updateFormValue.bind(this, 'roomNumber')}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="firstName" validationState={null}>
                <Col md={6}>
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl type="text" value={this.state.firstName} onChange={this.updateFormValue.bind(this, 'firstName')}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="lastName" validationState={null}>
                <Col md={6}>
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl type="text" value={this.state.lastName} onChange={this.updateFormValue.bind(this, 'lastName')}/>
                </Col>
              </FormGroup>

              <FormGroup controlId="phoneNumber" validationState={null}>
                <Col md={12}>
                  <ControlLabel>Phone Number</ControlLabel>
                  <FormControl type="tel" value={this.state.phoneNumber} onChange={this.updateFormValue.bind(this, 'phoneNumber')}/>
                </Col>
              </FormGroup>
            </Panel>
          </Tab>

          <Tab eventKey={2} title="Room Information"><br/>
            <Panel bsStyle="info" footer={informationFooter}>
              <FormGroup controlId="roomNumber" validationState={null}>
                <Col md={12}>
                  <ControlLabel>Room Number</ControlLabel>
                  <FormControl type="text" value={this.state.roomNumber} onChange={this.updateFormValue.bind(this, 'roomNumber')}/>
                </Col>
              </FormGroup>
            </Panel>
          </Tab>

          <Tab eventKey={3} title="Active Requests" onEntered={this.getAlerts}> <br/>
            <Panel bsStyle="info">
              <Table responsive striped hover className="alertTable">
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Name</th>
                        <th>Message</th>
                        <th>Send</th>
                    </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, i) => {
                    return (
                      <Alert key={i} roomNumber={alert.RoomNumber} fName={alert.FName} lName={alert.LName}
                      message={alert.Message} phoneNumber={alert.PhoneNumber} showAlert={this.showAlert} 
                      getAlerts={this.getAlerts}/>
                    );
                  })}
                </tbody>
              </Table>
            </Panel>
          </Tab>

        </Tabs>
      </div>

    );
  }
}
export default Container;