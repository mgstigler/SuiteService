'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let sns = new AWS.SNS();
let verificationCode = null;
class MFAService {
    sendVerificationCode(number, callback) {
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
exports.MFAService = MFAService;
exports.mfaService = new MFAService();
//# sourceMappingURL=mfaService.js.map