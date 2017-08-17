'use strict'

import * as AWS from 'aws-sdk';
let sns = new AWS.SNS();
let verificationCode = null;

export class MFAService {

    sendVerificationCode(number: String, callback) {
        verificationCode = Math.floor(1000 + Math.random() * 9000);
        console.log(verificationCode);
        let message = "Your verification code is " + verificationCode;
        let params = {
            Message: message,
            PhoneNumber: number
        };

        let request = sns.publish(params);
        console.info("This is our request:" + JSON.stringify(request));
        request.send(callback);
        return;
    }

    

}

export const mfaService = new MFAService();