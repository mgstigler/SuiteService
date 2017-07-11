'use strict';
import * as AWS from "aws-sdk";
import * as querystring from "querystring";


export class GuestService {

    getGuestInformation(deviceId: String, callback) {
        let docClient = new AWS.DynamoDB.DocumentClient()
        let table = "Guests";

        let params = {
            TableName: table,
            Key:{
                "AlexaId": deviceId
            }
        };

        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                callback(null);
            } else if (data.Item == null) {
                callback(null);
            }else{
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                callback(null);
                return data;
            }
        });
        
    }
    
}

export const guestService = new GuestService();