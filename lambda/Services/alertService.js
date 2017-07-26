'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let sns = new AWS.SNS();
class AlertService {
    sendAlert(message, topic, callback) {
        let params = {
            Message: message,
            TopicArn: topic
        };
        let request = sns.publish(params);
        console.info("This is our request:" + JSON.stringify(request));
        request.send(callback);
        return;
    }
    alertGuest(message, phoneNumber, callback) {
        let params = {
            Message: message,
            PhoneNumber: phoneNumber
        };
        let request = sns.publish(params);
        console.info("Message sent to user: " + message);
        request.send(callback);
    }
}
exports.AlertService = AlertService;
exports.alertService = new AlertService();
//# sourceMappingURL=alertService.js.map