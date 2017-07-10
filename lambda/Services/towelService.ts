'use strict'

import * as AWS from 'aws-sdk';

let sns = new AWS.SNS();

export class TowelService {

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

}

export const towelService = new TowelService();