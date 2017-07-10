"use strict";
exports.__esModule = true;
var Alexa = require("alexa-sdk");
var towelService_1 = require("./Services/towelService");
module.exports.SuiteService = function (event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = "amzn1.ask.skill.fabfb036-f98c-4273-80e2-508422489244";
    var deviceId = context.System.device.deviceId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
var handlers = {
    //Handles the launch request
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to Hotel Service!', 'Try saying food service.');
    },
    'OrderTowelIntent': function () {
        var message = "Please send towels to Laura.";
        var topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
        towelService_1.towelService.sendAlert(message, topic, null);
        this.emit(':ask', 'Of course. We will send a set of towels to your room right away. Do you need anything else?', 'Try saying I would like order something else.');
    },
    'AMAZON.StopIntent': function () {
        // State Automatically Saved with :tell
        this.emit(':tell', "Goodbye.");
    },
    'AMAZON.CancelIntent': function () {
        // State Automatically Saved with :tell
        this.emit(':tell', "Goodbye.");
    },
    'SessionEndedRequest': function () {
        // Force State Save When User Times Out
        this.emit(':saveState', true);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', "What would you like to do?", "What would you like to do?");
    },
    'Unhandled': function () {
        this.emit(':ask', "What would you like to do?", "What would you like to do?");
    }
};
