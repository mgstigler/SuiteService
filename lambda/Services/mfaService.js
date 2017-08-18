'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let sns = new AWS.SNS();
class MFAService {
    sendVerificationCode(number, callback) {
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
    verifyCode(number, verifiedCode, callback) {
        let verified = false;
        if (number == verifiedCode) {
            verified = true;
        }
        callback(verified);
    }
    createMfaResponse() {
    }
}
exports.MFAService = MFAService;
exports.mfaService = new MFAService();
//# sourceMappingURL=mfaService.js.map