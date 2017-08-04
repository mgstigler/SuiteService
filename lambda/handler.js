"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Alexa = require("alexa-sdk");
const alertService_1 = require("./Services/alertService");
const guestService_1 = require("./Services/guestService");
const foodService_1 = require("./Services/foodService");
const amenityService_1 = require("./Services/amenityService");
const lookupService_1 = require("./Services/lookupService");
let deviceId = null;
let guestInformation = null;
let cardTitle = '';
let cardContent = '';
let bucketPath = "https://s3.amazonaws.com/food-menu-images/";
let amenitiesBucketPath = "https://s3.amazonaws.com/amenities-images/";
module.exports.SuiteService = (event, context, callback) => {
    let alexa = Alexa.handler(event, context, callback);
    console.info(JSON.stringify(event));
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
        console.info("Service: " + service);
        let message = "Please send " + service + " to Laura.";
        lookupService_1.lookupService.slotExists(service, "ServiceLookup", slotFound => {
            if (slotFound) {
                alertService_1.alertService.addAlert(guestInformation, service);
                this.emit(':tell', 'Of course. We will send ' + service + ' to your room right away ' + guestInformation.FName);
            }
            else {
                this.emit(':tell', 'Sorry ' + guestInformation.FName + ' We do not provide ' + service + ' at this time.');
            }
        });
    },
    'RequestedPluralServiceIntent': function () {
        let number = this.event.request.intent.slots.requestNumber.value;
        let service = this.event.request.intent.slots.requestedPluralService.value;
        console.info("Service: " + service);
        lookupService_1.lookupService.slotExists(service, "ServiceLookup", slotFound => {
            if (slotFound) {
                let intentObj = this.event.request.intent;
                if (intentObj.slots.requestNumber.confirmationStatus !== 'CONFIRMED') {
                    if (intentObj.slots.requestNumber.confirmationStatus !== 'DENIED') {
                        // Slot value is not confirmed
                        let speechOutput = 'You want ' + intentObj.slots.requestNumber.value + ' ' + service + ', is that correct?';
                        this.emit(':confirmSlot', 'requestNumber', speechOutput, speechOutput);
                    }
                    else {
                        // Users denies the confirmation of slot value
                        let speechOutput = 'Okay, how many would you like?';
                        this.emit(':elicitSlot', 'requestNumber', speechOutput, speechOutput);
                    }
                }
                else {
                    this.emit(':tell', 'Great. We will send ' + number + service + ' to your room right away.');
                }
            }
            else {
                this.emit(':tell', 'Sorry ' + guestInformation.FName + ' We do not provide ' + service + ' at this time.');
            }
        });
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
    'HotelInfoHoursIntent': function () {
        let amenity = this.event.request.intent.slots.amenity.value;
        console.info("Amenity: " + amenity);
        amenityService_1.amenityService.getAmenity(amenity, amenityInfo => {
            console.info("Amenity Info: " + JSON.stringify(amenityInfo.Index));
            amenityService_1.amenityService.getStandardTime(amenityInfo.OpeningHour, amenityInfo.ClosingHour, standardTime => {
                console.info("Amenity info standard: " + JSON.stringify(standardTime));
                amenityService_1.amenityService.getHoursRemaining(amenityInfo, hoursRemaining => {
                    let imageObj = {
                        smallImageUrl: amenitiesBucketPath + JSON.stringify(amenityInfo.Index) + '.jpg',
                        largeImageUrl: amenitiesBucketPath + JSON.stringify(amenityInfo.Index) + '.jpg'
                    };
                    cardTitle = JSON.stringify(amenityInfo.Amenity);
                    cardContent = "Opening Hour: " + standardTime.openingTime + " Closing Hour: " + standardTime.closingTime;
                    if (hoursRemaining < 1) {
                        this.emit(':tell', 'The ' + amenity + 'is currently closed. The hours are ' + standardTime.openingTime + ' to ' + standardTime.closingTime);
                    }
                    else {
                        this.emit(':tell', 'The ' + amenity + ' is currently open and will remain open for ' + hoursRemaining + ' more hours. The full hours are ' + standardTime.openingTime + ' to ' + standardTime.closingTime);
                    }
                });
            });
        });
    },
    'FoodServiceIntent': function () {
        let food = this.event.request.intent.slots.foodItem.value;
        lookupService_1.lookupService.slotExists(food, "MenuLookup", slotFound => {
            if (slotFound) {
                console.info("slot found");
                foodService_1.foodService.getFoodInformation(food, foodInfo => {
                    if (this.event.request.intent.slots.foodItem.confirmationStatus !== 'CONFIRMED') {
                        if (this.event.request.intent.slots.foodItem.confirmationStatus !== 'DENIED') {
                            // guest has not added to order
                            console.info("Food Info: " + JSON.stringify(foodInfo.Index));
                            this.emit(':confirmSlot', 'foodItem', 'Would you like ' + foodInfo.Pairing + ' with that?', 'Would you like ' + foodInfo.Pairing + ' with that?');
                        }
                        else {
                            // guest says no nothing else
                            let message = "Please send " + food + " to Room " + guestInformation.RoomNumber;
                            foodService_1.foodService.updateRating(foodInfo);
                            var imageObj = {
                                smallImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg',
                                largeImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg'
                            };
                            cardTitle = JSON.stringify(foodInfo.FoodItem);
                            cardContent = "Rating: " + JSON.stringify(foodInfo.Rating) + " Price: $" + foodInfo.Price;
                            alertService_1.alertService.addAlert(guestInformation, food);
                            this.emit(':tellWithCard', 'We are sending ' + food + ' your way, ' + guestInformation.FName, cardTitle, cardContent, imageObj);
                        }
                    }
                    else {
                        //guest says yes to pairing
                        let message = "Please send " + food + " to Room " + guestInformation.RoomNumber;
                        foodService_1.foodService.updateRating(foodInfo);
                        //foodService get price of pairing
                        foodService_1.foodService.getFoodPrice(foodInfo.Pairing, pairingPrice => {
                            let totalPrice = pairingPrice + foodInfo.Price;
                            var imageObj = {
                                smallImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg',
                                largeImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg'
                            };
                            cardTitle = 'Ordering ' + food + ' and ' + JSON.stringify(foodInfo.Pairing);
                            cardContent = "Rating: " + JSON.stringify(foodInfo.Rating) + " Total Price: $" + totalPrice;
                            alertService_1.alertService.addAlert(guestInformation, food);
                            this.emit(':tellWithCard', 'The total price is ' + totalPrice + ' We are sending ' + food + ' and ' + foodInfo.Pairing + ' your way, ' + guestInformation.FName, cardTitle, cardContent, imageObj);
                        });
                    }
                });
            }
            else {
                console.info("item not found");
                this.emit(':ask', 'We are sorry.  We are not serving ' + food + ' at this moment. Is there something else I can get for you?', 'What can I do for you?');
            }
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
            this.emit(':askWithCard', 'We are serving ' + menu.speech + ' now.  This includes ' + menu.items[0] + ', ' + menu.items[1] + ', and more.  Place an order or say more', 'Okay', cardTitle, cardContent, imageObj);
        });
    },
    'ExtendStayIntent': function () {
        let days = this.event.request.intent.slots.days.value;
        alertService_1.alertService.addReservationAlert(guestInformation, days);
        this.emit(':tell', 'Your request to extend your stay by ' + days + ' days has been sent in.  You will receive a text when it has been accepted.');
    },
    'CheckOutIntent': function () {
        guestService_1.guestService.checkoutGuest(deviceId, success => {
            alertService_1.alertService.alertGuest('Thank you for staying with us.', guestInformation.PhoneNumber, null);
            this.emit(':tell', 'You are checked out.  Thank you for staying with us!  Come back soon.');
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