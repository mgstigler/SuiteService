'use strict';
import * as AWS from "aws-sdk";
import { RoomModel } from "../Shared/Models/roomModel"

module.exports.UpdateRoom = (event: RoomModel, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));

    let docClient = new AWS.DynamoDB.DocumentClient()

    let table = "Guests";

    // Update the item, unconditionally,

    let params = {
        TableName:table,
        Key:{
            "AlexaId": event.AlexaId
        },
        UpdateExpression: "set FName = :f, LName = :l, RoomNumber = :r",
        ExpressionAttributeValues:{
            ":f": event.FName,
            ":l": event.LName,
            ":r": event.RoomNumber
        },
        ReturnValues:"UPDATED_NEW"
    };

    let response = {
        statusCode: 200,
        message: ""
    };
       
    console.log("Updating the item...");
    docClient.update(params, function(err, data) {
        if (err) {
            response.statusCode = 500;
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            response.message = "Unable to update room";
            callback(null, response);
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            response.message = "Updated room with " + event.FName +  " " + event.LName + " successfully.";
            callback(null, response);
        }
    });
};
