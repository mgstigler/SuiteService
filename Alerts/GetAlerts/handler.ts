'use strict';
import * as AWS from "aws-sdk";
import * as querystring from "querystring";
import {alertService} from '../../lambda/Services/alertService'

module.exports.GetAlerts = (event, context, callback) => {
    console.info("Received event: ", JSON.stringify(event, null, 2));
    let docClient = new AWS.DynamoDB.DocumentClient()
    let alertList = [];

    let params = {
        TableName: "Alerts",
        IndexName: "isActive-index",
        KeyConditionExpression:"isActive = :a",
        ExpressionAttributeValues: {
            ":a": event.isActive
        }
    };

    let response = {
        statusCode: 200,
        message: ""
    };

    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            response.message = JSON.stringify(err, null, 2);
            callback(null, response);
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.info(JSON.stringify(item));
                response.message = JSON.stringify(item);
                alertList.push(item);
            });
            callback(null, alertList);
        }
    });
    
}
