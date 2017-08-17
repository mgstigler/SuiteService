import * as Alexa from 'alexa-sdk';
import * as AWS from "aws-sdk";


let deviceId = null;


module.exports.DeviceRegistration = (event, context, callback) => {
    let alexa = Alexa.handler(event, context, callback);
    console.info(JSON.stringify(event));
    deviceId = event.context.System.device.deviceId;
    console.info(deviceId);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
let handlers = {
    //Handles the launch request
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to Device Registration. Please say associate device with the room number you want.', 'What is the room number?');
    },
    
    'RegisterDevice': function () {
        let RoomNumber = this.event.request.intent.slots.roomnumber.value;
        let docClient = new AWS.DynamoDB.DocumentClient();

        let table = "Guests";

        let params = {
            TableName:"Guests",
            Item:{
                "AlexaId": deviceId,
                "RoomNumber": RoomNumber
            }
        };

        let response = {
            statusCode: 200,
            message: ""
        };


        console.log("Adding a new item...");
        docClient.put(params, (err, data) => {
            if (err) {
                response.statusCode = 500;
                console.error("Unable to create Room. Error JSON:", JSON.stringify(err, null, 2));
                response.message = "Unable to associate device";
                this.emit(':tell', "We could not associate the device at this time");   
            } else if(params == null){
                response.statusCode = 404;
                response.message = "Unable to associate device";
                this.emit(':tell', "We could not associate the device at this time");                        
            } else {
                response.statusCode = 200;
                response.message = "Device associated";
                this.emit(':tell', "The device is now associated with room " + RoomNumber);                        
            }
        });
    },

  'AMAZON.StopIntent': function () {
  // State Automatically Saved with :tell
  this.emit(':tell', `Goodbye.`);
  },

  'AMAZON.CancelIntent': function () {
  // State Automatically Saved with :tell
  this.emit(':tell', `Goodbye.`);
  },

  'SessionEndedRequest': function () {
  // Force State Save When User Times Out
  this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function () {
  this.emit(':ask', `What would you like to do?`,  `What would you like to do?`);
  },

  'Unhandled' : function () {
  this.emit(':ask', `What would you like to do?`,  `What would you like to do?`);
  }

};


    