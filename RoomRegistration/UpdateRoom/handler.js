'use strict';
exports.__esModule = true;
var AWS = require("aws-sdk");
module.exports.UpdateRoom = function (event, context, callback) {
    console.info("Received event: ", JSON.stringify(event, null, 2));
    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "Guests";
    // Update the item, unconditionally,
    var params = {
        TableName: table,
        Key: {
            "AlexaId": event.AlexaId
        },
        UpdateExpression: "set FName = :f, LName = :l, RoomNumber = :r",
        ExpressionAttributeValues: {
            ":f": event.FName,
            ":l": event.LName,
            ":r": event.RoomNumber
        },
        ReturnValues: "UPDATED_NEW"
    };
    var response = {
        statusCode: 200,
        message: ""
    };
    console.log("Updating the item...");
    docClient.update(params, function (err, data) {
        if (err) {
            response.statusCode = 500;
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            response.message = "Unable to update room";
            callback(null, response);
        }
        else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            response.message = "Updated room with " + event.FName + " " + event.LName + " successfully.";
            callback(null, response);
        }
    });
};
