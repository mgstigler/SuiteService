'use strict';
exports.__esModule = true;
var AWS = require("aws-sdk");
module.exports.GetRoom = function (event, context, callback) {
    console.info("Received event: ", JSON.stringify(event, null, 2));
    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "Guests";
    console.info(event);
    var response = {
        statusCode: 200,
        message: ""
    };
    var params = {
        TableName: table,
        Key: {
            "AlexaId": event.AlexaId
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            response.statusCode = 500;
            response.message = "Cannot find room for " + event.AlexaId;
            callback(null, response);
        }
        else if (data.Item == null) {
            response.statusCode = 404;
            response.message = "Cannot find room for " + event.AlexaId;
            callback(null, response);
        }
        else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            response.message = "Room retrieved: " + JSON.stringify(data);
            callback(null, response);
        }
    });
};
