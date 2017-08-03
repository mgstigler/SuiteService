'use strict';
import * as AWS from "aws-sdk";
import {alertService} from '../../lambda/Services/alertService';
import * as request from "request";

module.exports.UpdateReservation = (event, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));

    let docClient = new AWS.DynamoDB.DocumentClient()

    //send alert to guest
    alertService.alertGuest(event.Message, event.PhoneNumber, null);

    // Update the Request in Reservations table
    let params = {
        TableName:"Reservations",
        Key:{
            "RoomNumber": event.RoomNumber
        },
        UpdateExpression: "set isActive = :a, CheckOut = :o",
        ExpressionAttributeValues:{
            ":a": "0",
            ":o": event.CheckOut
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

    //update guest information in guest table
    var options = {
        url: 'https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room?RoomNumber=' + event.RoomNumber,
        method: 'POST',
        json: {
            'RoomNumber': event.RoomNumber, 
            'FName': event.FName,
            'LName': event.LName,
            'PhoneNumber': event.PhoneNumber,
            'CheckIn' : event.CheckIn,
            'CheckOut': event.CheckOut
        }
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    })
}
