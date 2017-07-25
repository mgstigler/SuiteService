"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const guestService_1 = require("./Services/guestService");
let deviceId = null;
module.exports.SuiteService = (event, context, callback) => {
    let alexa = Alexa.handler(event, context, callback);
    // alexa.appId = "amzn1.ask.skill.fabfb036-f98c-4273-80e2-508422489244";
    // Uncomment when using actual device
    deviceId = event.context.System.device.deviceId;
    console.info(deviceId);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
let handlers = {
    //Handles the launch request
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to Hotel Service!', 'Try saying food service.');
    },
    'OrderTowelIntent': function () {
        guestService_1.guestService.getGuestInformation(deviceId, guestInfo => {
            console.info("Guest " + guestInfo);
            let roomNumber = JSON.stringify(guestInfo.RoomNumber);
            let guestName = JSON.stringify(guestInfo.FName);
            let message = "Please send towels to Room " + roomNumber;
            let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
            // towelService.sendAlert(message, topic, null);
            this.emit(':ask', 'Of course. We will send a set of towels to your room right away ' + guestName + '. Do you need anything else?', 'Try saying I would like order something else.');
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
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', `What would you like to do?`, `What would you like to do?`);
    },
    'Unhandled': function () {
        this.emit(':ask', `What would you like to do?`, `What would you like to do?`);
    }
};
//# sourceMappingURL=handler.js.map