'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
module.exports.UpdateRoom = (event, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));
    let docClient = new AWS.DynamoDB.DocumentClient();
    let table = "HotelGuests";
    // Update the item, unconditionally,
    let params = {
        TableName: table,
        Key: {
            "RoomNumber": event.RoomNumber
        },
        UpdateExpression: "set FName = :f, LName = :l",
        ExpressionAttributeValues: {
            ":f": event.FName,
            ":l": event.LName
        },
        ReturnValues: "UPDATED_NEW"
    };
    let response = {
        statusCode: 200,
        message: ""
    };
    console.log("Updating the item...");
    docClient.update(params, function (err, data) {
        if (err) {
            response.statusCode = 500;
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            response.message = "Unable to update " + event.RoomNumber;
            callback(null, response);
        }
        else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            response.message = "Updated room with " + event.FName + " " + event.LName + " successfully.";
            callback(null, response);
        }
    });
};
//# sourceMappingURL=handler.js.map