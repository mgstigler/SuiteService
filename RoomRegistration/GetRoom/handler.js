'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
module.exports.GetRoom = (event, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));
    let docClient = new AWS.DynamoDB.DocumentClient();
    let table = "Guests";
    console.info(event);
    let response = {
        statusCode: 200,
        message: "",
        data: null
    };
    let params = {
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
            response.data = data;
            callback(null, response);
        }
        else if (data.Item == null) {
            response.statusCode = 404;
            response.message = "Cannot find room for " + event.AlexaId;
            response.data = data;
            callback(null, response);
        }
        else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            response.statusCode = 200;
            response.message = "Room retrieved: " + JSON.stringify(data);
            response.data = data;
            callback(null, response);
        }
    });
};
//# sourceMappingURL=handler.js.map