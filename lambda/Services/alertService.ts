'use strict'

import * as AWS from 'aws-sdk';
import {guestModel} from '../Models/guestModel';
let sns = new AWS.SNS();

export class AlertService {

    sendAlert(message: String, topic: String, callback) {
        let params = {
            Message: message,
            TopicArn: topic
        };

        let request = sns.publish(params);
        console.info("This is our request:" + JSON.stringify(request));
        request.send(callback);
        return;
    }

    alertGuest(message: String, number: String, callback) {
        let params = {
            Message: message,
            PhoneNumber: number
        };

        let request = sns.publish(params);
        console.info("Message sent to guest: " + message);
        request.send(callback)
    }

    addAlert(guest: guestModel, service: String) {
        let time = new Date();
        let timestamp = {
            "Month": time.getMonth() + 1,
            "Date": time.getDate(),
            "Hours": time.getHours(),
            "Minutes": time.getMinutes(),
            "Seconds": time.getSeconds(),
            "UTCSeconds" : time.getTime()
        };
        console.info(JSON.stringify(timestamp));
        let docClient = new AWS.DynamoDB.DocumentClient();
        let message = 'Hello ' + guest.FName + ', we are sending ' + service + ' to room ' + guest.RoomNumber + ' now.';
        let params = {
            TableName: "Alerts",
            Item:{
                "RoomNumber": guest.RoomNumber,
                "isActive": "1",
                "FName": guest.FName,
                "LName": guest.LName,
                "PhoneNumber": guest.PhoneNumber,
                "Message": message,
                "Timestamp": timestamp
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
                console.error("Unable to create Alert. Error JSON:", JSON.stringify(err, null, 2));
                response.message = "Unable to create Alert.";
            } else if(params == null){
                response.statusCode = 404;
                response.message = "Unable to create Room Alert.";
            } else {
                response.statusCode = 200;
                response.message = "Created alert for " + guest.RoomNumber + ". Message attached is: " + message;
            }
        });
    }

}

export const alertService = new AlertService();