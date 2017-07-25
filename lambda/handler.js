"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const guestService_1 = require("./Services/guestService");
const foodService_1 = require("./Services/foodService");
let deviceId = null;
let guestInformation = null;
let cardTitle = '';
let cardContent = '';
let bucketPath = "https://s3.amazonaws.com/food-menu-images/";
module.exports.SuiteService = (event, context, callback) => {
    let alexa = Alexa.handler(event, context, callback);
    // alexa.appId = "amzn1.ask.skill.fabfb036-f98c-4273-80e2-508422489244";
    // Uncomment when using actual device
    // deviceId = event.context.System.device.deviceId;
    deviceId = "amzn1.ask.device.AEDESKFZ4SBJNWU3M7EXRX7NJL5DTLKLAP2KRVBKYQ5PYRNQRUWZBSUKWWWW4DDJOCZE3WC2XBWJHQJ4PVMN5HBHLY4UHSK5W76VCAJ5L7NNSIRNHHSTG5WA66NRWQCWJ22R2LGSICQHW2SFNV6V3EIVVCUA";
    console.info(deviceId);
    guestService_1.guestService.getGuestInformation(deviceId, guestInfo => {
        guestInformation = guestInfo;
        alexa.registerHandlers(handlers);
        alexa.execute();
    });
};
let handlers = {
    //Handles the launch request
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to Hotel Service!', 'Try saying food service.');
    },
    'OrderTowelIntent': function () {
        let message = "Please send towels to Room " + guestInformation.RoomNumber;
        let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
        // towelService.sendAlert(message, topic, null);
        this.emit(':ask', 'Of course. We will send a set of towels to your room right away ' + JSON.stringify(guestInformation.FName) + '. Do you need anything else?', 'Try saying I would like order something else.');
    },
    'FoodServiceIntent': function () {
        let food = this.event.request.intent.slots.foodItem.value;
        foodService_1.foodService.getFoodInformation(food, foodInfo => {
            console.info("Food Info: " + JSON.stringify(foodInfo.Index));
            let message = "Please send " + food + " to Room " + guestInformation.RoomNumber;
            let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
            // towelService.sendAlert(message, topic, null);
            foodService_1.foodService.updateRating(foodInfo);
            var imageObj = {
                smallImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg',
                largeImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg'
            };
            cardTitle = JSON.stringify(foodInfo.FoodItem);
            cardContent = "Rating: " + JSON.stringify(foodInfo.Rating);
            this.emit(':askWithCard', 'Sending ' + food + ' your way, ' + guestInformation.FName, cardTitle, cardContent, imageObj);
        });
    },
    'MenuIntent': function () {
        this.emit(':ask', 'Reading menu items now');
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