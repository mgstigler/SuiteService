'use strict'

import * as AWS from 'aws-sdk';
let sns = new AWS.SNS();
let verificationCode = null;

export class MFAService {

    sendVerificationCode(number: string, callback) {
        verificationCode = Math.floor(1000 + Math.random() * 9000);
        console.log(verificationCode);
        let message = "Your verification code is " + verificationCode;
        let params = {
            Message: message,
            PhoneNumber: number
        };
        console.info("request " + JSON.stringify(params));
        let request = sns.publish(params);
        request.send(callback);
        return;
    }

    verifyCode(number: number, callback) {
        let verified = false;
        if (number == verificationCode) {
            verified = true;
        }
        callback(verified);
    }

    

}

export const mfaService = new MFAService();