"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const alertService_1 = require("./Services/alertService");
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
    // Uncomment below when testing with an actual device
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
        this.emit(':ask', 'Welcome to Suite Service, ' + guestInformation.FName + '!', 'Try saying food service.');
    },
    'RequestSingularServiceIntent': function () {
        let service = this.event.request.intent.slots.requestedSingularService.value;
        let message = "Please send " + service + " to Laura.";
        let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
        // towelService_1.towelService.sendAlert(message, topic, null);
        alertService_1.alertService.addAlert(guestInformation, service);
        this.emit(':tell', 'Of course. We will send ' + service + ' to your room right away ' + guestInformation.FName);
    },
    'RequestedPluralServiceIntent': function () {
        let number = this.event.request.intent.slots.requestNumber.value;
        let service = this.event.request.intent.slots.requestedPluralService.value;
        let message = "Please send " + number + service + " to Laura.";
        let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";

        var intentObj = this.event.request.intent;
        if (intentObj.slots.requestNumber.confirmationStatus !== 'CONFIRMED') {
            if (intentObj.slots.requestNumber.confirmationStatus !== 'DENIED') {
                // Slot value is not confirmed
                var slotToConfirm = 'requestNumber';
                var speechOutput = 'You want' + intentObj.slots.requestNumber.value + service + ', is that correct?';
                var repromptSpeech = speechOutput;
                this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
            } else {
                // Users denies the confirmation of slot value
                var slotToElicit = 'requestNumber';
                var speechOutput = 'Okay, how many would you like?';
                this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
            }
        }  else {
            this.emit(':tell', 'Of course. We will send ' + number + service + ' to your room right away');
        }

        // towelService_1.towelService.sendAlert(message, topic, null);
<<<<<<< HEAD
        alertService_1.alertService.addAlert(guestInformation, service);
        this.emit(':tell', 'Of course. We will send ' + number + service + ' to your room right away ' + guestInformation.FName);
    },
    'FoodServiceIntent': function () {
=======

    }, 
    'FoodServiceIntent':function () {
>>>>>>> 14f125c5761093438a18f911e9e104f23aad9cea
        let food = this.event.request.intent.slots.foodItem.value;
        foodService_1.foodService.getFoodInformation(food, foodInfo => {
            console.info("Food Info: " + JSON.stringify(foodInfo.Index));
            let message = "Please send " + food + " to Room " + guestInformation.RoomNumber;
            let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
            // alertService.sendAlert(message, topic, null);
            foodService_1.foodService.updateRating(foodInfo);
            var imageObj = {
                smallImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg',
                largeImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg'
            };
            cardTitle = JSON.stringify(foodInfo.FoodItem);
            cardContent = "Rating: " + JSON.stringify(foodInfo.Rating);
            this.emit(':askWithCard', 'We are sending ' + food + ' your way, ' + guestInformation.FName, cardTitle, cardContent, imageObj);
        });
    },
    'MenuIntent': function () {
        foodService_1.foodService.getMenu(menu => {
            var imageObj = {
                smallImageUrl: bucketPath + menu.image + '.jpg',
                largeImageUrl: bucketPath + menu.image + '.jpg'
            };
            console.info(menu.speech);
            cardTitle = menu.speech + ' Menu';
            cardContent = menu.items.join(", and ");
            this.emit(':askWithCard', 'We are serving ' + menu.speech + ' now.  This includes ' + menu.items.join(", and ") + '. What can I get for you?', 'Okay', cardTitle, cardContent, imageObj);
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