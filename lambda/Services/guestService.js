'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let https = require("https");
class GuestService {
    getGuestInformation(deviceId, callback) {
        // let parsedData = null;
        // let url =  'https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room?AlexaId=' + deviceId;
        // https.get(url, (response) => {
        //     console.info("Response is, Response Status Code: " + response.statusCode + ", Response Message: " + response.statusMessage);
        //     let rawData = "";
        //     response.on('data', (chunk) => rawData += chunk);
        //     response.on('end', () => {
        //         try {
        //             let parsedData = JSON.parse(rawData);
        //             let result = parsedData.data.Item;
        //             console.info("PD: " + JSON.stringify(parsedData.data.Item));
        //             if (parsedData.error) {
        //                 throw new Error(JSON.stringify(parsedData.error));
        //             }
        //             else {
        //                 console.info("I have the guest data now");
        //                 callback(result);
        //             }
        //         }
        //         catch (e) {
        //             console.error(e);
        //         }
        //     });
        // }).on('error', (e) => {
        //     console.error(e);
        // });
        let docClient = new AWS.DynamoDB.DocumentClient();
        let table = "Guests";
        let response = {
            statusCode: 200,
            message: "",
            data: null
        };
        let params = {
            TableName: "Guests",
            Key: {
                "AlexaId": deviceId
            }
        };
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                response.statusCode = 500;
                response.message = "Cannot find room for " + deviceId;
                response.data = data;
            }
            else if (data.Item == null) {
                response.statusCode = 404;
                response.message = "Cannot find room for " + deviceId;
                response.data = data;
            }
            else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                response.statusCode = 200;
                response.message = "Room retrieved: " + JSON.stringify(data);
                response.data = data;
                callback(data.Item);
            }
        });
    }
}
exports.GuestService = GuestService;
exports.guestService = new GuestService();
//# sourceMappingURL=guestService.js.map