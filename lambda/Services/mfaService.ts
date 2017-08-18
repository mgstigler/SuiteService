'use strict'

import * as AWS from 'aws-sdk';
import {mfaModel} from "../Models/mfaModel";
let sns = new AWS.SNS();

export class MFAService {

    sendVerificationCode(number: string, callback) {
        let verificationCode = Math.floor(1000 + Math.random() * 9000);
        console.log(verificationCode);
        let message = "Your verification code is " + verificationCode;
        let params = {
            Message: message,
            PhoneNumber: number
        };
        console.info("request " + JSON.stringify(params));
        let request = sns.publish(params);
        request.send();
        callback(verificationCode);
    }

    verifyCode(number: number, verifiedCode: number, callback) {
        let verified = false;
        if (number == verifiedCode) {
            verified = true;
        }
        callback(verified);
    }

}

export const mfaService = new MFAService();