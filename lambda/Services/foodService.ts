'use strict';
import * as AWS from "aws-sdk";
import {foodModel} from "../Models/foodModel";
let docClient = new AWS.DynamoDB.DocumentClient()
let table = "FoodService";

export class FoodService {
    getFoodInformation(foodItem: string, callback) {
        let params = {
            TableName: table,
            IndexName: "FoodItem-index",
            KeyConditionExpression:"FoodItem = :f",
            ExpressionAttributeValues: {
                ":f": foodItem
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
                    console.info("Food Info" + JSON.stringify(item));
                    response.message = JSON.stringify(item);
                    callback(item);
                });
            }
        });

    }

    updateRating(foodItem: foodModel) {
        let params = {
            TableName:table,
            Key:{
                "Index": foodItem.Index
            },
            UpdateExpression: "set Rating = :r",
            ExpressionAttributeValues:{
                ":r": foodItem.Rating += 1
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }

}

export const foodService = new FoodService();