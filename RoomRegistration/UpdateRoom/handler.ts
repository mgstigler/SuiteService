'use strict';
import * as AWS from "aws-sdk";
import { RoomModel } from "../Shared/Models/roomModel"

module.exports.UpdateRoom = (event, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));

    let docClient = new AWS.DynamoDB.DocumentClient()

    let table = "Guests";
    // Update the item, unconditionally,

    let params = {
        TableName: "Guests",
        IndexName: "RoomNumber-index",
        KeyConditionExpression:"RoomNumber = :r",
        ExpressionAttributeValues: {
            ":r": event.RoomNumber
        }
    };

    let response = {
        statusCode: 200,
        message: ""
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                let params1 = {
                    TableName:"Guests",
                    Key:{
                        "AlexaId": item.AlexaId
                    },
                    UpdateExpression: "set RoomNumber = :r, FName = :f, LName = :l, PhoneNumber = :p, CheckIn = :i, CheckOut = :o",
                    ExpressionAttributeValues:{
                        ":r": event.RoomNumber,
                        ":f": event.FName,
                        ":l": event.LName,
                        ":p": event.PhoneNumber,
                        ":i": event.CheckIn,
                        ":o": event.CheckOut
                    },
                    ReturnValues:"UPDATED_NEW"
                };

                docClient.update(params1, function(err, data) {
                    if (err) {
                        response.statusCode = 500;
                        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                        response.message = "Unable to update room";
                        callback(null, response);
                    } else {
                        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                        response.statusCode = 200;
                        response.message = "Updated room with " + event.FName +  " " + event.LName + " successfully.";
                        callback(null, response);
                    }
                });
            });
        }
    });

};
