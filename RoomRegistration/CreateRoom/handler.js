'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
module.exports.CreateRoom = (event, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));
    let docClient = new AWS.DynamoDB.DocumentClient();
    let table = "Guests";
    let params = {
        TableName: table,
        Item: {
            "AlexaId": event.AlexaId,
            "RoomNumber": event.RoomNumber
        }
    };
    let response = {
        statusCode: 200,
        message: ""
    };
    console.log("Adding a new item...");
    docClient.put(params, (err, data) => {
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
            response.statusCode = 200;
            response.message = "Created Room " + event.RoomNumber + " succeeded.";
            callback(null, response);
        }
    });
};
//# sourceMappingURL=handler.js.map