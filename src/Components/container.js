import React from 'react';
import axios from 'axios';
import css from '../styles/Container.css';
import InfoModal from './infoModal';
import {Button, Panel, FormGroup, ControlLabel, FormControl, Col, PageHeader, Tabs, Tab} from 'react-bootstrap';

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
      phoneNumber: ""
    };
    this.getRoomInformation = this.getRoomInformation.bind(this);
    this.updateRoomInformation = this.updateRoomInformation.bind(this);
  }

  updateRoomInformation() {
    axios.post("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room", {
      AlexaId: this.state.alexaId,
      RoomNumber: this.state.roomNumber,
      FName: this.state.firstName,
      LName: this.state.lastName,
      PhoneNumber: this.state.phoneNumber
    }).then(function(response){
      console.log(response.data)
    }).catch(function(error){
      console.log(error);
    })
  }

  getRoomInformation() {
      axios.get("https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room?AlexaId=" + this.state.alexaId)
      .then(function(response){
          console.log(response.data)
      }).catch(function(error){
          console.log(error);
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
      <InfoModal alexaId={this.state.alexaId}/>
    );

    return (

      <div className={'container'} style={{width: '600px'}}>

        <PageHeader>Suite Service <small>Registration Portal</small></PageHeader>

        <Tabs bsStyle="pills" defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Guest Registration"> <br/>
            <Panel bsStyle="info" footer={registrationFooter}>
              <FormGroup controlId="alexaID" validationState={null}>
                <Col md={12}>
                  <ControlLabel>Alexa ID</ControlLabel>
                  <FormControl type="text" value={this.state.alexaID} onChange={this.updateFormValue.bind(this, 'alexaId')}/>
                </Col>
              </FormGroup>

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

              <FormGroup controlId="alexaID" validationState={null}>
                <Col md={12}>
                  <ControlLabel>Phone Number</ControlLabel>
                  <FormControl type="tel" value={this.state.phoneNumber} onChange={this.updateFormValue.bind(this, 'phoneNumber')}/>
                </Col>
              </FormGroup>
            </Panel>
          </Tab>

          <Tab eventKey={2} title="Room Information"><br/>
            <Panel bsStyle="info" footer={informationFooter}>
              <FormGroup controlId="alexaID" validationState={null}>
                <Col md={12}>
                  <ControlLabel>Alexa ID</ControlLabel>
                  <FormControl type="text" value={this.state.alexaID} onChange={this.updateFormValue.bind(this, 'alexaId')}/>
                </Col>
              </FormGroup>
            </Panel>
          </Tab>
        </Tabs>

        

      </div>

    );
  }
}
export default Container;