'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let https = require("https");
class GuestService {
    getGuestInformation(deviceId, callback) {
        let docClient = new AWS.DynamoDB.DocumentClient();
        let table = "Guests";
        let response = {
            statusCode: 200,
            message: "",
            data: null
        };
        let params = {
            TableName: "Guests",
            Key: {
                "AlexaId": deviceId
            }
        };
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                response.statusCode = 500;
                response.message = "Cannot find room for " + deviceId;
                response.data = data;
            }
            else if (data.Item == null) {
                response.statusCode = 404;
                response.message = "Cannot find room for " + deviceId;
                response.data = data;
            }
            else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                response.statusCode = 200;
                response.message = "Room retrieved: " + JSON.stringify(data);
                response.data = data;
                callback(data.Item);
            }
        });
    }
    checkoutGuest(deviceId, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: "Guests",
            Key: {
                "AlexaId": deviceId
            },
            UpdateExpression: "set FName = :f, LName = :l, CheckIn = :i, CheckOut = :o, PhoneNumber = :p, RoomStatus = :rs",
            ExpressionAttributeValues: {
                ":f": null,
                ":l": null,
                ":p": null,
                ":o": null,
                ":i": null,
                ":rs": 'notReady'
            },
            ReturnValues: "UPDATED_NEW"
        };
        console.log("Updating the item...");
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                callback (null);
            }
        });
    }
    updateRoomStatus(deviceId, phoneNumber, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: "Guests",
            Key: {
                "AlexaId": deviceId
            },
            UpdateExpression: "set RoomStatus = :rs",
            ExpressionAttributeValues: {
                ":rs": 'Clean', 
            },
            ReturnValues: "UPDATED_NEW"
        };
        console.log("Updating the item...");
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                callback (null);
            }
        });
        
    }
}
    
exports.GuestService = GuestService;
exports.guestService = new GuestService();
//# sourceMappingURL=guestService.js.map