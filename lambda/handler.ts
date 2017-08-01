import * as Alexa from 'alexa-sdk';
import {alertService} from './Services/alertService';
import {guestService} from './Services/guestService';
import {foodService} from './Services/foodService';
import {amenityService} from './Services/amenityService';
import {lookupService} from './Services/lookupService';
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
  // deviceId = event.context.System.device.deviceId;
  deviceId = "amzn1.ask.device.AEDESKFZ4SBJNWU3M7EXRX7NJL5DTLKLAP2KRVBKYQ5PYRNQRUWZBSUKWWWW4DDJOCZE3WC2XBWJHQJ4PVMN5HBHLY4UHSK5W76VCAJ5L7NNSIRNHHSTG5WA66NRWQCWJ22R2LGSICQHW2SFNV6V3EIVVCUA";
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
  guestService.getGuestInformation(deviceId, guestInfo => {
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
    lookupService.slotExists(service, "ServiceLookup", slotFound => {
        if(slotFound) {
          alertService.addAlert(guestInformation, service);
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
    let message = "Please send " + number + service + " to Laura.";
    lookupService.slotExists(service, "ServiceLookup", slotFound => {
        if(slotFound) {
          alertService.addAlert(guestInformation, service);
          this.emit(':tell', 'Of course. We will send ' + service + ' to your room right away ' + guestInformation.FName);
        }
        else {
          this.emit(':tell', 'Sorry ' + guestInformation.FName + ' We do not provide ' + service + ' at this time.');
        }
    });
  },

  'HotelInfoLocationIntent': function() {
    let amenity = this.event.request.intent.slots.amenity.value;
    console.info("Amenity: " + amenity);
    amenityService.getAmenity(amenity, amenityInfo => {
      console.info("Amenity Info: " + JSON.stringify(amenityInfo.Index));
      amenityService.getStandardTime(amenityInfo.OpeningHour, amenityInfo.ClosingHour, standardTime => {
          console.info("Amenity info standard: " + JSON.stringify(standardTime));
          amenityService.getHoursRemaining(amenityInfo, hoursRemaining => {
            var imageObj = {
          						    smallImageUrl: amenitiesBucketPath + JSON.stringify(amenityInfo.Index) + '.jpg',
          						    largeImageUrl: amenitiesBucketPath + JSON.stringify(amenityInfo.Index) + '.jpg'
          						};
                    	cardTitle = JSON.stringify(amenityInfo.Amenity);
                    	cardContent = "Opening Hour: " + standardTime.openingTime +  " Closing Hour: " + standardTime.closingTime ;
            this.emit(':tellWithCard', 'The hours are ' + standardTime.openingTime + ' to ' + standardTime.closingTime + ' and you have ' + hoursRemaining + ' hours remaining.', cardTitle, cardContent, imageObj);     
          })
      });      
    });
  },

  'FoodServiceIntent': function() {
      let food = this.event.request.intent.slots.foodItem.value;
      lookupService.slotExists(food, "MenuLookup", slotFound => {
        if(slotFound) {
          foodService.getFoodInformation(food, foodInfo => {
            console.info("Food Info: " + JSON.stringify(foodInfo.Index) );
            let message = "Please send " + food + " to Room " + guestInformation.RoomNumber;
            foodService.updateRating(foodInfo);
            var imageObj = {
          						    smallImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg',
          						    largeImageUrl: bucketPath + JSON.stringify(foodInfo.Index) + '.jpg'
            };
            cardTitle = JSON.stringify(foodInfo.FoodItem);
            cardContent = "Rating: " + JSON.stringify(foodInfo.Rating) +  " Price: $" + foodInfo.Price ;
            alertService.addAlert(guestInformation, food);
            this.emit(':tellWithCard', 'We are sending ' + food + ' your way, ' + guestInformation.FName, cardTitle, cardContent, imageObj);
          })
        }
        else {
          this.emit(':ask', 'We are sorry.  We are not serving ' + food + ' at this moment. Is there something else I can get for you?', 'What can I do for you?');
        }
      });
  },
  'MenuIntent': function() {
      foodService.getMenu(menu => {
        var imageObj = {
          						    smallImageUrl: bucketPath + menu.image + '.jpg',
          						    largeImageUrl: bucketPath + menu.image + '.jpg'
          						};
        console.info("Menu: " + menu.speech);
        cardTitle = menu.speech + ' Menu';
        cardContent = menu.items.join(", and ");
        this.emit(':askWithCard', 'We are serving ' + menu.speech + ' now.  This includes ' + menu.items[0] + ', ' + menu.items[1] + ', and more.  Place an order or say more', 'Okay', cardTitle, cardContent, imageObj);
      })
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


    