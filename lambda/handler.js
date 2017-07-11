"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const towelService_1 = require("./Services/towelService");
module.exports.SuiteService = (event, context, callback) => {
    let alexa = Alexa.handler(event, context, callback);
    //alexa.appId = "amzn1.ask.skill.117130a7-6610-4832-8b8c-04e38f10d840";
    alexa.registerHandlers(handlers);
    alexa.execute();
};
let handlers = {
    //Handles the launch request
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to Hotel Service!');
    },
    'RequestSingularServiceIntent': function () {
        let message = "Please send " + this.event.request.intent.slots.RequestSingularServiceIntent.value + " to Laura.";
        let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
        towelService_1.towelService.sendAlert(message, topic, null);
        this.emit(':ask', 'Of course. We will send ' + this.event.request.intent.slots.requestnumber.value + " " + this.event.request.intent.slots.requestedPluralService.value + ' to your room right away');
    },
    'RequestedPluralServiceIntent': function () {
        let message = "Please send " + this.event.request.intent.slots.requestNumber.value + " " + this.event.request.intent.slots.requestedPluralService.value + "  to Laura.";
        let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
        towelService_1.towelService.sendAlert(message, topic, null);
        this.emit(':ask', 'Of course. We will send ' + this.event.request.intent.slots.requestNumber.value + " " + this.event.request.intent.slots.requestedPluralService.value  + ' to your room right away.')  
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