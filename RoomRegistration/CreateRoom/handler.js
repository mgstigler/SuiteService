'use strict';
exports.__esModule = true;
var AWS = require("aws-sdk");
module.exports.CreateRoom = function (event, context, callback) {
    console.info("Received event: ", JSON.stringify(event, null, 2));
    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "Guests";
    var params = {
        TableName: table,
        Item: {
            "AlexaId": event.AlexaId,
            "RoomNumber": event.RoomNumber
        }
    };
    var response = {
        statusCode: 200,
        message: ""
    };
    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            response.statusCode = 500;
            console.error("Unable to create Room. Error JSON:", JSON.stringify(err, null, 2));
            response.message = "Unable to create Room " + event.RoomNumber;
            callback(null, response);
        }
        else if (params == null) {
            response.statusCode = 404;
            response.message = "Unable to create Room " + event.RoomNumber;
            callback(null, response);
        }
        else {
            response.message = "Created Room " + event.RoomNumber + " succeeded.";
            callback(null, response);
        }
    });
};
