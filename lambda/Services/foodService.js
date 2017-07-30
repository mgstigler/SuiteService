'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let docClient = new AWS.DynamoDB.DocumentClient();
class FoodService {
    getFoodInformation(foodItem, callback) {
        let params = {
            TableName: "FoodService",
            IndexName: "FoodItem-index",
            KeyConditionExpression: "FoodItem = :f",
            ExpressionAttributeValues: {
                ":f": foodItem
            }
        };
        let response = {
            statusCode: 200,
            message: ""
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("Query succeeded.");
                data.Items.forEach(function (item) {
                    console.info("Food Info" + JSON.stringify(item));
                    response.message = JSON.stringify(item);
                    callback(item);
                });
            }
        });
    }
    updateRating(foodItem) {
        let params = {
            TableName: "FoodService",
            Key: {
                "Index": foodItem.Index
            },
            UpdateExpression: "set Rating = :r",
            ExpressionAttributeValues: {
                ":r": foodItem.Rating += 1
            },
            ReturnValues: "UPDATED_NEW"
        };
        docClient.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }
    getMenu(callback) {
        let date = new Date();
        let currentHour = (date.getHours() + 20) % 24;
        console.info("Current Hour: " + currentHour);
        let Menu = {
            speech: '',
            items: [],
            image: ''
        };
        if (currentHour > 17) {
            Menu.speech = 'Dinner, Late Night, and Dessert';
            this.getItemsByMenu('Dinner', 'Late Night', 'Dessert', response => {
                Menu.items = response;
                Menu.image = '3';
                callback(Menu);
            });
        }
        else if (currentHour > 11) {
            Menu.speech = 'Lunch and Dessert';
            this.getItemsByMenu('Lunch', 'Dessert', null, response => {
                Menu.items = response;
                Menu.image = '2';
                callback(Menu);
            });
        }
        else {
            Menu.speech = 'Breakfast';
            this.getItemsByMenu('Breakfast', null, null, response => {
                Menu.items = response;
                Menu.image = '4';
                callback(Menu);
            });
        }
    }
    getItemsByMenu(menu1, menu2, menu3, callback) {
        let response = [];
        let params = {
            TableName: "FoodService"
        };
        console.log("Scanning table.");
        docClient.scan(params, onScan);
        function onScan(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("Scan succeeded.");
                data.Items.forEach(function (item) {
                    if (item.Menu.values.includes(menu1) || item.Menu.values.includes(menu2) || item.Menu.values.includes(menu3)) {
                        console.info(JSON.stringify(item.FoodItem));
                        response.push(item.FoodItem);
                    }
                });
                console.info(response);
                callback(response);
            }
        }
    }
    ;
}
exports.FoodService = FoodService;
exports.foodService = new FoodService();
//# sourceMappingURL=foodService.js.map