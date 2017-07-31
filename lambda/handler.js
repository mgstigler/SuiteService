"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const alertService_1 = require("./Services/alertService");
const guestService_1 = require("./Services/guestService");
const foodService_1 = require("./Services/foodService");
const amenityService_1 = require("./Services/amenityService");
let deviceId = null;
let guestInformation = null;
let cardTitle = '';
let cardContent = '';
let bucketPath = "https://s3.amazonaws.com/food-menu-images/";
let amenitiesBucketPath = "https://s3.amazonaws.com/amenities-images/";
module.exports.SuiteService = (event, context, callback) => {
    let alexa = Alexa.handler(event, context, callback);
    // alexa.appId = "amzn1.ask.skill.fabfb036-f98c-4273-80e2-508422489244";
    // Uncomment below when testing with an actual device
    deviceId = event.context.System.device.deviceId;
    // deviceId = "amzn1.ask.device.AEDESKFZ4SBJNWU3M7EXRX7NJL5DTLKLAP2KRVBKYQ5PYRNQRUWZBSUKWWWW4DDJOCZE3WC2XBWJHQJ4PVMN5HBHLY4UHSK5W76VCAJ5L7NNSIRNHHSTG5WA66NRWQCWJ22R2LGSICQHW2SFNV6V3EIVVCUA";
    console.info(deviceId);
    // let amenity = {
    //   "Index": 1,
    //   "Amenity": "string",
    //   "ClosingHour": 22,
    //   "OpeningHour": 8,
    //   "Location": "pool"
    // };
    // amenityService.getHoursRemaining(amenity, answer => {
    //   console.info(answer);
    //   console.info(JSON.stringify(answer));
    // })
    // amenityService.getStandardTime(8, 22, myhours => {
    //   console.info(myhours);
    //   console.info(JSON.stringify(myhours));
    // })
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
        // towelService_1.towelService.sendAlert(message, topic, null);
        alertService_1.alertService.addAlert(guestInformation, service);
        this.emit(':tell', 'Of course. We will send ' + number + service + ' to your room right away ' + guestInformation.FName);
    },
    'HotelInfoLocationIntent': function () {
        let amenity = this.event.request.intent.slots.amenity.value;
        console.info("Amenity: " + amenity);
        amenityService_1.amenityService.getAmenity(amenity, amenityInfo => {
            console.info("Amenity Info: " + JSON.stringify(amenityInfo.Index));
            amenityService_1.amenityService.getStandardTime(amenityInfo.OpeningHour, amenityInfo.ClosingHour, standardTime => {
                console.info("Amenity info standard: " + JSON.stringify(standardTime));
                amenityService_1.amenityService.getHoursRemaining(amenityInfo, hoursRemaining => {
                    var imageObj = {
                        smallImageUrl: amenitiesBucketPath + JSON.stringify(amenityInfo.Index) + '.jpg',
                        largeImageUrl: amenitiesBucketPath + JSON.stringify(amenityInfo.Index) + '.jpg'
                    };
                    cardTitle = JSON.stringify(amenityInfo.Amenity);
                    cardContent = "Opening Hour: " + standardTime.openingTime + " Closing Hour: " + standardTime.closingTime;
                    this.emit(':tellWithCard', 'The hours are ' + standardTime.openingTime + ' to ' + standardTime.closingTime + ' and you have ' + hoursRemaining + ' hours remaining.', cardTitle, cardContent, imageObj);
                });
            });
        });
    },
    'FoodServiceIntent': function () {
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
            cardContent = "Rating: " + JSON.stringify(foodInfo.Rating) + " Price: $" + foodInfo.Price;
            this.emit(':askWithCard', 'We are sending ' + food + ' your way, ' + guestInformation.FName, 'Okay', cardTitle, cardContent, imageObj);
        });
    },
    'MenuIntent': function () {
        foodService_1.foodService.getMenu(menu => {
            var imageObj = {
                smallImageUrl: bucketPath + menu.image + '.jpg',
                largeImageUrl: bucketPath + menu.image + '.jpg'
            };
            console.info("Menu: " + menu.speech);
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