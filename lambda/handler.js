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

var handlers = {
    'RequestSingularServiceIntent': function () {
        let service = this.event.request.intent.slots.requestedSingularService.value;
        var intentObj = this.event.request.intent;
        if (intentObj.slots.requestedSingularService.confirmationStatus !== 'CONFIRMED') {
            if (intentObj.slots.requestedSingularService.confirmationStatus !== 'DENIED') {
                // Slot value is not confirmed 
                var slotToConfirm = 'requestedSingularService';
                var speechOutput = 'You want ' + service + ', is that correct?';
                var repromptSpeech = speechOutput;
                this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
            } else {
                // Users denies the confirmation of slot value 
                var slotToElicit = 'requestedSingularService';
                var speechOutput = 'Okay, what would you like to order?';
                this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
            }

         } else {
            let message = "Please send " + service + " to Laura.";
            let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
            towelService_1.towelService.sendAlert(message, topic, null);
            this.emit(':ask', 'Of course. We will send ' + service + ' to your room right away. Is there anything else I can do for you?', 'Is there anything else I can do for you?');
            var intentobj2 = this.event.request.intent.name;
                console.log(JSON.parse(intentobj2));
                if (intentobj2 = AMAZON.YesIntent) {
                    this.emit(':ask', 'Ok. What can I do?')
                }
                else {
                    this.emit(':tell', 'Ok, thanks. See you later. I will be listening')
                }
         }
    }
};

// var handlers = {
//     'LaunchRequest': function () {
//          this.emit(':ask', 'Welcome to Hotel Service!');
//      },

//     'RequestSingularServiceIntent': function () {
//         let service = this.event.request.intent.slots.requestedSingularService.value;
//         let message = "Please send " + service + " to Laura.";
//         let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";

//         var intentObj = this.event.request.intent;
//         if (intentObj.confirmationStatus !== 'CONFIRMED') {
//             if (intentObj.confirmationStatus !== 'DENIED') {
//                 // Intent is not confirmed 
//                 var speechOutput = 'You want to order ' + service + ', is that correct?';
//                 var repromptSpeech = speechOutput;
//                 this.emit(':confirmIntentWithCard', speechOutput, repromptSpeech);
//             } else {
//                 // Users denies the confirmation of intent. May be value of the slots are not correct. 
//                 handleIntentConfimationDenial();
//             }
//         } else {
//             handlePlanMyTripIntentAllSlotsAndIntentAreConfirmed();
//         }
//     }
// };
// let handlers = {
//     //Handles the launch request
//     'LaunchRequest': function () {
//         this.emit(':ask', 'Welcome to Hotel Service!');
//     },
//     'RequestSingularServiceIntent': function () {
//         let service = this.event.request.intent.slots.requestedSingularService.value;
//         let message = "Please send " + service + " to Laura.";
//         let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
//         towelService_1.towelService.sendAlert(message, topic, null);
//         this.emit(':ask', 'Of course. We will send ' + service + ' to your room right away');
//     },
//     'RequestedPluralServiceIntent': function () {
//         let number = this.event.request.intent.slots.requestNumber.value;
//         let service = this.event.request.intent.slots.requestedPluralService.value;
//         let message = "Please send " + number + service + "  to Laura.";
//         let topic = "arn:aws:sns:us-east-1:202274289241:TowelService";
//         //towelService_1.towelService.sendAlert(message, topic, null);
//         this.emit(':confirmSlot', "requestNumber", "Did you say" + number + service, "reprompt", this.event.request.intent); 
//         if (JSON.stringify(this.event.request.intent.slots.requestNumber.confirmationStatus) == "CONFIRMED" ) {
//             towelService_1.towelService.sendAlert(message, topic, null);
//             this.emit(':ask', 'Great. We will send ' + number + service + ' to your room right away')
//         }
//         console.log(JSON.stringify(this.event));
//     },
//     'AMAZON.StopIntent': function () {
//         // State Automatically Saved with :tell
//         this.emit(':tell', `Goodbye.`);
//     },
//     'AMAZON.CancelIntent': function () {
//         // State Automatically Saved with :tell
//         this.emit(':tell', `Goodbye.`);
//     },
//     'SessionEndedRequest': function () {
//         // Force State Save When User Times Out
//         this.emit(':saveState', true);
//     },
//     'AMAZON.HelpIntent': function () {
//         this.emit(':ask', `What would you like to do?`, `What would you like to do?`);
//     },
//     'Unhandled': function () {
//         this.emit(':ask', `What would you like to do?`, `What would you like to do?`);
//     }
// };
//# sourceMappingURL=handler.js.map