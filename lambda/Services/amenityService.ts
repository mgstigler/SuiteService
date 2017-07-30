'use strict';
import * as AWS from "aws-sdk";

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

};

export const amenityService = new AmenityService();