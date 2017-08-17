'use strict';
exports.__esModule = true;
var AWS = require("aws-sdk");
var sns = new AWS.SNS();
var verificationCode = null;
var MFAService = (function () {
    function MFAService() {
    }
    MFAService.prototype.sendVerificationCode = function (number, callback) {
        verificationCode = Math.floor(1000 + Math.random() * 9000);
        console.log(verificationCode);
        var message = "Your verification code is " + verificationCode;
        var params = {
            Message: message,
            PhoneNumber: number
        };
        console.info("request " + JSON.stringify(params));
        var request = sns.publish(params);
        request.send(callback);
        return;
    };
    MFAService.prototype.verifyCode = function (number, callback) {
        var verified = false;
        if (number == verificationCode) {
            verified = true;
        }
        callback(verified);
    };
    return MFAService;
}());
exports.MFAService = MFAService;
exports.mfaService = new MFAService();
