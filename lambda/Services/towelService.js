'use strict';
exports.__esModule = true;
var AWS = require("aws-sdk");
var sns = new AWS.SNS();
var TowelService = (function () {
    function TowelService() {
    }
    TowelService.prototype.sendAlert = function (message, topic, callback) {
        var params = {
            Message: message,
            TopicArn: topic
        };
        var request = sns.publish(params);
        console.info("This is our request:" + JSON.stringify(request));
        request.send(callback);
        return;
    };
    return TowelService;
}());
exports.TowelService = TowelService;
exports.towelService = new TowelService();
