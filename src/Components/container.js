import React from 'react';
import axios from 'axios';
import css from '../styles/Container.css';
import InfoModal from './infoModal';
import Alert from './alert';
import Reservation from './reservation';
import {Button, Panel, FormGroup, ControlLabel, FormControl, Col, PageHeader, Tabs, Tab, Table, Well} from 'react-bootstrap';
import _ from 'lodash';
import AlertContainer from 'react-alert';
import FontAwesome from 'react-fontawesome';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import '../../node_modules/react-datepicker/dist/react-datepicker.css';
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
      alertsArr: [],
      resArr: [],
      startDate: null,
      startDateSeconds: null,
      endDate: null,
      endDateSeconds: null
    };
    this.updateRoomInformation = this.updateRoomInformation.bind(this);
    this.getAlerts = this.getAlerts.bind(this);
    this.getReservationRequests = this.getReservationRequests.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.clearState = this.clearState.bind(this);
    this.clearRegistration = this.clearRegistration.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);

    this.alertOptions = {
      offset: 14,
      position: 'top left',
      theme: 'dark',
      transition: 'scale'
    }
  }

  handleStartDateChange(date) {
    var newDate = new Date((date._d).getTime() + 14400000);
    this.setState({
      startDate: date,
      startDateSeconds: newDate.getTime()
    });
  }

  handleEndDateChange(date) {
    var newDate = new Date((date._d).getTime() + 14400000);
    this.setState({
      endDate: date,
      endDateSeconds: newDate.getTime()
    });
  }

  getAlerts() {
    var _this = this;
    axios.get("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/alerts?isActive=1")
    .then(function(response){
      var arr = response.data
      arr.sort(function(a, b){
        return a.Timestamp.UTCSeconds - b.Timestamp.UTCSeconds;
      });
      _this.setState({alertsArr: arr});
    }).catch(function(error){
      console.log(error);
    })
  }

  getReservationRequests() {
    var _this = this;
    axios.get("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/reservations?isActive=1")
    .then(function(response){
      var arr = response.data
      arr.sort(function(a, b){
        return a.Timestamp.UTCSeconds - b.Timestamp.UTCSeconds;
      });
      _this.setState({resArr: arr});
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
    this.setState({startDate: null});
    this.setState({endDate: null});
    this.setState({startDateSeconds: null});
    this.setState({endDateSeconds: null});
  }

  updateRoomInformation() {
    var _this = this;
    axios.post("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room", {
      RoomNumber: this.state.roomNumber,
      FName: this.state.firstName,
      LName: this.state.lastName,
      PhoneNumber: this.state.phoneNumber,
      CheckIn: this.state.startDateSeconds,
      CheckOut: this.state.endDateSeconds
    }).then(function(response){
      var msg = 'The room was updated successfully with ' + _this.state.firstName + ' ' + _this.state.lastName;
      _this.showAlert(msg, 'success', 'check', '#19a745');
      _this.clearState();
    }).catch(function(error){
      console.log(error);
      var msg = "There was an issue updating the room.";
      _this.showAlert(msg, 'error', 'times', '#E74C3C');
    })
  }

  clearRegistration(){
    var _this = this;
    if(this.state.roomNumber !== ""){
      axios.post("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room", {
        RoomNumber: this.state.roomNumber,
        FName: null,
        LName: null,
        PhoneNumber: null,
        CheckIn: null,
        CheckOut: null
      }).then(function(response){
        if(response.data.statusCode === 200){
          var msg = 'The guest was successfully unregistered from room #' + _this.state.roomNumber;
          _this.showAlert(msg, 'success', 'check', '#19a745');
          _this.clearState();
        }
        else {
          var msg = "There was an issue updating the room.";
          _this.showAlert(msg, 'error', 'times', '#E74C3C');
        }
      }).catch(function(error){
        console.log(error);
        var msg = "There was an issue updating the room.";
        _this.showAlert(msg, 'error', 'times', '#E74C3C');
      });
    }
    else {
      var msg = "Please enter a room number";
      _this.showAlert(msg, 'error', 'warning', '#e4de12');
    }  
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
    var checkoutFooter = (
      <Button bsStyle="warning" className="unregisterButton" onClick={this.clearRegistration}>
        Checkout
      </Button>
    );
    var informationFooter = (
      <InfoModal roomNumber={this.state.roomNumber} showAlert={this.showAlert}/>
    );

    var alerts = this.state.alertsArr;
    var reservationRequests = this.state.resArr;

    return (

      <div className={'container'} style={{width: '800px'}}>

        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <PageHeader>Suite Service <small>Registration Portal</small></PageHeader>

        <Tabs bsStyle="pills" defaultActiveKey={1} id="uncontrolled-tab-example">

         {/* Guest registration tab */}
          <Tab eventKey={1} title="Guest Registration"> <br/>
            <Panel bsStyle="info" footer={registrationFooter}>
              <Well>Enter guest information to register a visitor to the Alexa device</Well>
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


              <FormGroup controlId="startDate" validationState={null}>
                <Col md={6}>
                  <ControlLabel>Check-In Date</ControlLabel>
                  <DatePicker selected={this.state.startDate} onChange={this.handleStartDateChange} />
                </Col>
              </FormGroup>

              <FormGroup controlId="endDate" validationState={null}>
                <Col md={6}>
                  <ControlLabel>Check-Out Date</ControlLabel>
                  <DatePicker selected={this.state.endDate} onChange={this.handleEndDateChange} />
                </Col>
              </FormGroup>

            </Panel>
          </Tab>

          {/* Retrieve room information tab */}
          <Tab eventKey={2} title="Room Information"><br/>
            <Panel bsStyle="info" footer={informationFooter}>
              <Well>Enter room number to view current guest information</Well>
              <FormGroup controlId="roomNumber" validationState={null}>
                <Col md={12}>
                  <ControlLabel>Room Number</ControlLabel>
                  <FormControl type="text" value={this.state.roomNumber} onChange={this.updateFormValue.bind(this, 'roomNumber')}/>
                </Col>
              </FormGroup>
            </Panel>
          </Tab>

          {/* Guest checkout/unregister tab */}
          <Tab eventKey={3} title="Guest Checkout"><br/>
            <Panel bsStyle="info" footer={checkoutFooter}>
              <Well>Enter room number to unregister current guest</Well>
              <FormGroup controlId="roomNumber" validationState={null}>
                <Col md={12}>
                  <ControlLabel>Room Number</ControlLabel>
                  <FormControl type="text" value={this.state.roomNumber} onChange={this.updateFormValue.bind(this, 'roomNumber')}/>
                </Col>
              </FormGroup>
            </Panel>
          </Tab>

          {/* Get/send active requests tab */}
          <Tab eventKey={4} title="Active Requests" onEntered={this.getAlerts}> <br/>
            <Panel bsStyle="info">
              <Table responsive striped hover className="alertTable">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th style={{textAlign: 'center'}}>Room Number</th>
                        <th>Name</th>
                        <th>Request</th>
                        <th style={{textAlign: 'center', width: '100px'}}>Confirm Request</th>
                    </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, i) => {
                    return (
                      <Alert key={i} roomNumber={alert.RoomNumber} fName={alert.FName} lName={alert.LName}
                      message={alert.Message} phoneNumber={alert.PhoneNumber} showAlert={this.showAlert} 
                      timestamp={alert.Timestamp} service={alert.Service} getAlerts={this.getAlerts}/>
                    );
                  })}
                </tbody>
              </Table>
            </Panel>
          </Tab>

          <Tab eventKey={5} title="Reservation Requests" onEntered={this.getReservationRequests}> <br/>
            <Panel bsStyle="info">
              <Table responsive striped hover className="reservationTable">
                <thead>
                    <tr>
                        <th>Room Number</th>
                        <th>Name</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th style={{textAlign: 'center', width: '100px'}}>Confirm Request</th>
                    </tr>
                </thead>
                <tbody>
                  {reservationRequests.map((res, i) => {
                    return (
                      <Reservation key={i} roomNumber={res.RoomNumber} fName={res.FName} lName={res.LName}
                      message={res.Message} showAlert={this.showAlert} checkIn={res.CheckIn} 
                      checkOut={res.CheckOut} timestamp={res.Timestamp} phoneNumber={res.PhoneNumber}
                      getReservationRequests={this.getReservationRequests}/>
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