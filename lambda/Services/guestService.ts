'use strict';
import * as AWS from "aws-sdk";
import * as querystring from "querystring";
import {guestModel} from "../Models/guestModel";
let https = require("https");


export class GuestService {

    getGuestInformation(deviceId: String, callback) {
        let docClient = new AWS.DynamoDB.DocumentClient();
        let table = "Guests";

        let response = {
            statusCode: 200,
            message: "",
            data: null
        };

        let params = {
            TableName: "Guests",
            Key:{
                "AlexaId": deviceId
            }
        };

        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                response.statusCode = 500;
                response.message = "Cannot find room for " + deviceId;
                response.data = data;
            } else if (data.Item == null) {
                response.statusCode = 404;
                response.message = "Cannot find room for " + deviceId;
                response.data = data;
            }else{
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                response.statusCode = 200;
                response.message = "Room retrieved: " + JSON.stringify(data);
                response.data = data;
                callback(data.Item);
            }
        });
    }

    checkoutGuest(deviceId:String, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: "Guests",
            Key:{
                "AlexaId": deviceId
            },
            UpdateExpression: "set FName = :f, LName = :l, CheckIn = :i, CheckOut = :o, PhoneNumber = :p",
            ExpressionAttributeValues:{
                ":f":null,
                ":l":null,
                ":p":null,
                ":o":null,
                ":i":null
            },
            ReturnValues:"UPDATED_NEW"
        };

        console.log("Updating the item...");
        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }
    
}

export const guestService = new GuestService();