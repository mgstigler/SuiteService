'use strict'

import * as AWS from 'aws-sdk';

let sns = new AWS.SNS();

export class AlertService {

    sendAlert(message: String, topic: String, callback) {
        let params = {
            Message: message,
            TopicArn: topic
        };

        let request = sns.publish(params);
        console.info("This is our request:" + JSON.stringify(request));
        request.send(callback);
        return;
    }

    alertGuest(message: String, phoneNumber: string, callback) {
        let params = {
            Message: message,
            PhoneNumber: phoneNumber
        };

        let request = sns.publish(params);
        console.info("Message sent to user: " + message);
        request.send(callback);
    }

}

export const alertService = new AlertService();