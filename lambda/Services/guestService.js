'use strict';
exports.__esModule = true;
var AWS = require("aws-sdk");
var GuestService = (function () {
    function GuestService() {
    }
    GuestService.prototype.getGuestInformation = function (deviceId, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var table = "Guests";
        var params = {
            TableName: table,
            Key: {
                "AlexaId": deviceId
            }
        };
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                callback(null);
            }
            else if (data.Item == null) {
                callback(null);
            }
            else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                callback(null);
                return data;
            }
        });
    };
    return GuestService;
}());
exports.GuestService = GuestService;
exports.guestService = new GuestService();
