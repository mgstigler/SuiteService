'use strict';
import * as AWS from "aws-sdk";
import * as querystring from "querystring";
import {guestModel} from "../Models/guestModel";
let https = require("https");


export class GuestService {

    getGuestInformation(deviceId: String, callback) {
        let parsedData = null;
        let url =  'https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room?AlexaId=' + deviceId;
        https.get(url, (response) => {
            console.info("Response is, Response Status Code: " + response.statusCode + ", Response Message: " + response.statusMessage);
            let rawData = "";
            response.on('data', (chunk) => rawData += chunk);
            response.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    let result = parsedData.data.Item;
                    console.info("PD: " + JSON.stringify(parsedData.data.Item));
                    if (parsedData.error) {
                        throw new Error(JSON.stringify(parsedData.error));
                    }
                    else {
                        console.info("I have the guest data now");
                        callback(result);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
        }).on('error', (e) => {
            console.error(e);
        });
    }
    
}

export const guestService = new GuestService();