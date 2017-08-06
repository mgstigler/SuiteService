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
let SessionState = false;
let bucketPath = "https://s3.amazonaws.com/food-menu-images/";
let amenitiesBucketPath = "https://s3.amazonaws.com/amenities-images/";

let sessionState = false;
let doneService ='';

module.exports.SuiteService = (event, context, callback) => {
    let alexa = Alexa.handler(event, context, callback);
    console.info(JSON.stringify(event));
    // alexa.appId = "amzn1.ask.skill.fabfb036-f98c-4273-80e2-508422489244";
    // Uncomment below when testing with an actual device
    deviceId = event.context.System.device.deviceId;
    // deviceId = "amzn1.ask.device.AEDESKFZ4SBJNWU3M7EXRX7NJL5DTLKLAP2KRVBKYQ5PYRNQRUWZBSUKWWWW4DDJOCZE3WC2XBWJHQJ4PVMN5HBHLY4UHSK5W76VCAJ5L7NNSIRNHHSTG5WA66NRWQCWJ22R2LGSICQHW2SFNV6V3EIVVCUA";
    console.info(deviceId);
    guestService_1.guestService.getGuestInformation(deviceId, guestInfo => {
        guestInformation = guestInfo;
        alexa.registerHandlers(handlers);
        alexa.execute();
    });
};
let handlers = {
    //I love you maddie
    //Handles the launch request
    'LaunchRequest': function () {
        this.emit(':ask', guestInformation.FName + ', Welcome to Suite Service, your personal front desk assistant. What can I help you with today?', 'If you need something, please ask?');
    },
    
    'RequestSingularServiceIntent': function () {
        let service = this.event.request.intent.slots.requestedSingularService.value;
        console.info("Service: " + service);
        let message = "Please send " + service + " to Laura.";
        lookupService_1.lookupService.slotExists(service, "ServiceLookup", slotFound => {
            if (slotFound) {
                if (SessionState==false){
                    SessionState=true;
                    alertService_1.alertService.addAlert(guestInformation, service);
                    this.emit(':ask', 'Ok ' + guestInformation.FName + ' , We can send a ' + service + ' to you in room ' + guestInformation.RoomNumber + '. If you would like anything else, please ask. If not, say done');
                    doneService = service + 'is';
                }
                else {
                    this.emit (':tell', 'Sure, we can add ' + service + ' to your request. You will receive a text when everything is on its way.')
                    SessionState=false;
                }
            }
            else {
                this.emit(':tell', 'Sorry ' + guestInformation.FName + ' We do not provide ' + service + ' at this time.');
                SessionState=false;
            }
        });
    },
    'DoneIntent': function () {
        this.emit(':tell', 'Ok, you will receive a text when your ' + doneService + ' on the way.');
        SessionState=false; 
        doneService='';       
    },
    'RequestedPluralServiceIntent': function () {
        let number = this.event.request.intent.slots.requestNumber.value;
        let service = this.event.request.intent.slots.requestedPluralService.value;
        doneService=service;
        console.info("Service: " + service);
        lookupService_1.lookupService.slotExists(service, "ServiceLookup", slotFound => {
          if (slotFound) {
            var intentObj = this.event.request.intent;
            if (intentObj.slots.requestNumber.confirmationStatus !== 'CONFIRMED') {
              if (intentObj.slots.requestNumber.confirmationStatus !== 'DENIED') {
                // Slot value is not confirmed
                var speechOutput = 'You want ' + intentObj.slots.requestNumber.value + ' ' + service + ', is that correct?';
                this.emit(':confirmSlot', 'requestNumber', speechOutput, speechOutput);
              } else {
                // Users denies the confirmation of slot value
                var speechOutput = 'Okay, how many would you like?';
                this.emit(':elicitSlot', 'requestNumber', speechOutput, speechOutput);
              }
            }  else {  
                if (SessionState==false){
                    SessionState=true;  
                    this.emit(':ask', 'Ok. We can send ' + number + service + ' to your room. If you would like anything else, please ask. If not, say done');
                    doneService=service + 'are';
                }
                else {
                    this.emit (':tell', 'Ok, we can add ' + service + ' to your request. You will receive a text when everything is on its way.')
                    SessionState=false;
                }
            }
          }
          else {
            this.emit(':tell', 'Sorry ' + guestInformation.FName + ' We do not provide ' + service + ' at this time. If you would like something else, please ask. If not, say done.', 'Would you like anything else? If not, say done.');
          }
        });
    },
    // 'ForgotIntent': function(){
    //     let number = 0;
    //     let service = this.event.request.intent.slots.itemNeeded.value;
    //     doneService=service;
    //     console.info("Service: " + service);
    //     lookupService_1.lookupService.slotExists(service, "ServiceLookup", slotFound => {
    //       if (slotFound) {
    //         var intentObj = this.event.request.intent;
    //         if (intentObj.slots.requestNumber.confirmationStatus !== 'CONFIRMED') {
    //           if (intentObj.slots.requestNumber.confirmationStatus !== 'DENIED') {
    //             // Slot value is not confirmed
    //             var speechOutput = 'No problem, we can help you. How many ' + service + 'do you need?';
    //             this.emit(':confirmSlot', 'requestNumber', speechOutput, speechOutput);
    //           } else {
    //             // Users denies the confirmation of slot value
    //             var speechOutput = 'Im sorry, how many would you like?';
    //             this.emit(':elicitSlot', 'requestNumber', speechOutput, speechOutput);
    //           }
    //         }  else {  
    //             if (SessionState==false){
    //                 SessionState=true;  
    //                 this.emit(':ask', 'Ok. We can send ' + number + service + ' to your room. If you would like anything else, please ask. If not, say done');
    //                 doneService=service + 'are';
    //             }
    //             else {
    //                 this.emit (':tell', 'Sure, we can add ' + service + ' to your request. You will receive a text when everything is on its way.')
    //                 SessionState=false;
    //             }
    //         }
    //       }
    //       else {
    //         this.emit(':tell', 'Sorry ' + guestInformation.FName + ' We do not provide ' + service + ' at this time. If you would like something else, please ask. If not, say done.', 'Would you like anything else? If not, say done.');
    //       }
    //     });
    // },
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
                    if (hoursRemaining < 1) {
                        this.emit(':tell', amenityInfo.Location + '. It is currently closed. The hours are ' + standardTime.openingTime + ' to ' +  standardTime.closingTime);                      
                    }
                    else {
                        this.emit(':tell', amenityInfo.Location + '. It is currently open and will remain open for ' + hoursRemaining + ' more hours. The full hours are ' + standardTime.openingTime + ' to ' + standardTime.closingTime);                        
                    }  
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
                foodService_1.foodService.getFoodInformation(slotFound.ItemNoArticle, foodInfo => {
                    if (this.event.request.intent.slots.foodItem.confirmationStatus !== 'CONFIRMED') {
                        if (this.event.request.intent.slots.foodItem.confirmationStatus !== 'DENIED') {
                            // guest has not added to order
                            console.info("Food Info: " + JSON.stringify(foodInfo.Index));
                            this.emit(':confirmSlot', 'foodItem', 'Ok, we can submit a room service order for ' + food + '. Would you like ' + foodInfo.Pairing + ' with that?', 'Would you like ' + foodInfo.Pairing + ' with that?');
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
                            this.emit(':tellWithCard', 'Ok, no problem. We will send ' + food + ' to room ' + guestInformation.RoomNumber + ' right away. That will be ' + foodInfo.Price + ' dollars. You will get a text when your order is on the way', cardTitle, cardContent, imageObj);
                        }
                    }
                    else {
                        //guest says yes to pairing
                        let message = "Please send " + food + " to Room " + guestInformation.RoomNumber;
                        foodService_1.foodService.updateRating(foodInfo);
                         //foodService get price of pairing
                        foodService_1.foodService.getFoodPrice(foodInfo.Pairing, pairingPrice => {
                            let totalPrice = foodInfo.CombinedPrice;
                       var imageObj = {
                            smallImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg',
                            largeImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg'
                        };
                           cardTitle = 'Ordering ' + food + ' and ' + JSON.stringify(foodInfo.Pairing);
                            cardContent = "Rating: " + JSON.stringify(foodInfo.Rating) + " Total Price: $" + totalPrice;
                         alertService_1.alertService.addAlert(guestInformation, food);
                             this.emit(':tellWithCard', 'Great, We will submit your order for ' + food + ' and ' + foodInfo.Pairing + '. The total cost is ' + totalPrice + ' dollars. You will get a text when the order is on the way.', cardTitle, cardContent, imageObj);
                        });
                    }
                });
            }
            else {
                console.info("item not found");
                this.emit(':ask', 'We are sorry.  We are not serving ' + food + ' at this moment. If you would like something else, please ask.', 'Ask me for something else if you would like');
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
        this.emit(':tell', `Goodbye. Thanks for using SuiteService.`);
        SessionState=false;
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