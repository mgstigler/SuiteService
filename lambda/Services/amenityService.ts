'use strict';
import * as AWS from "aws-sdk";
import {amenityModel} from "../Services/amenityService";

let docClient = new AWS.DynamoDB.DocumentClient()

export class AmenityService {

    //Function returns hours and location for the amenity
    getAmenity(amenity: string, callback) {
        let params = {
            TableName: "Amenities",
            IndexName: "Amenity-index",
            KeyConditionExpression:"Amenity = :a",
            ExpressionAttributeValues: {
                ":a": amenity
            }
        };

        let response = {
            statusCode: 200,
            message: ""
        };

        docClient.query(params, function(err, data) {
            console.info(data);
            console.info(JSON.stringify(data));
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
                data.Items.forEach(function(item) {
                    console.info("Amenity Info" + JSON.stringify(item));
                    response.message = JSON.stringify(item);
                    callback(item);
                });
            }
        });
    }

    getStandardTime(openingHour: number, closingHour: number, callback) {
        let StandardTime = {
            openingTime: "",
            closingTime: ""
        }

        let openingStandard = openingHour == 12 || openingHour == 24 ? 12 : openingHour % 12;
        let openingMeridian = openingHour >= 12 && openingHour != 24 ? "P.M." : "A.M.";

        let closingStandard = closingHour == 12 || closingHour == 24 ? 12 : closingHour % 12;
        let closingMeridian = closingHour >= 12 && closingHour != 24 ? "P.M." : "A.M.";
        
        StandardTime.openingTime = openingStandard + " " + openingMeridian;
        StandardTime.closingTime = closingStandard + " " + closingMeridian;
        callback(StandardTime); 
    }

    getHoursRemaining(amenity : amenityModel, callback) {
        let hours = new Date().getHours();
        let hour = hours -4;
        console.info("Hour: " + hour);
        console.info("Closing hour: " + amenity.ClosingHour);
        let remaining = 0;
        if(hour > amenity.ClosingHour) {
            callback(0);
        }
        else {
            remaining = amenity.ClosingHour - hour;
            callback(remaining);
        }        
    }



};

export const amenityService = new AmenityService();