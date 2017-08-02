'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const alertService_1 = require("../../lambda/Services/alertService");
module.exports.UpdateReservation = (event, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));
    let docClient = new AWS.DynamoDB.DocumentClient();
    // Update the item, unconditionally,
    alertService_1.alertService.alertGuest(event.Message, event.PhoneNumber, null);
    let params = {
        TableName: "Reservations",
        Key: {
            "RoomNumber": event.RoomNumber
        },
        UpdateExpression: "set isActive = :a, CheckIn = :i, CheckOut = :o",
        ExpressionAttributeValues: {
            ":a": "0",
            ":o": event.CheckOut,
            ":i": event.CheckIn
        },
        ReturnValues: "UPDATED_NEW"
    };
    let response = {
        "statusCode": 200,
        "message": ''
    };
    docClient.update(params, function (err, data) {
        if (err) {
            response.statusCode = 500;
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            response.message = "Unable to update alert";
            callback(null, response);
        }
        else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            response.statusCode = 200;
            response.message = "Updated alert successfully.";
            callback(null, response);
        }
    });
};
//# sourceMappingURL=handler.js.map