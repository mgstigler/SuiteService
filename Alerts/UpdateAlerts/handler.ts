'use strict';
import * as AWS from "aws-sdk";
import {alertService} from '../../lambda/Services/alertService'

module.exports.UpdateAlert = (event, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));

    let docClient = new AWS.DynamoDB.DocumentClient()

    // Update the item, unconditionally,
    alertService.alertGuest(event.Message, event.PhoneNumber, null);

    let params = {
        TableName:"Alerts",
        Key:{
            "Message": event.Message
        },
        UpdateExpression: "set FName = :f, LName = :l, PhoneNumber = :p, isActive = :a, RoomNumber = :r",
        ExpressionAttributeValues:{
            ":f": event.FName,
            ":l": event.LName,
            ":p": event.PhoneNumber,
            ":a": "0",
            ":r": event.RoomNumber
        },
        ReturnValues:"UPDATED_NEW"
    };

    let response = {
        "statusCode": 200,
        "message":''
    };

    docClient.update(params, function(err, data) {
        if (err) {
            response.statusCode = 500;
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            response.message = "Unable to update alert";
            callback(null, response);
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            response.statusCode = 200;
            response.message = "Updated alert successfully.";
            callback(null, response);
        }
    });
}
