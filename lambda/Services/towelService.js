'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let sns = new AWS.SNS();
class TowelService {
    sendAlert(message, topic, callback) {
        let params = {
            Message: message,
            TopicArn: topic
        };
        let request = sns.publish(params);
        console.info("This is our request:" + request);
        request.send(callback);
        return;
    }
}
exports.TowelService = TowelService;
exports.towelService = new TowelService();
//# sourceMappingURL=towelService.js.map