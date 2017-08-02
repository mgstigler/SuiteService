'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let docClient = new AWS.DynamoDB.DocumentClient();
class LookupService {
    slotExists(slot, tableName, callback) {
        let response = {
            statusCode: 200,
            message: "",
            data: null
        };
        let params = {
            TableName: tableName,
            Key: {
                "Item": slot
            }
        };
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                response.statusCode = 500;
                response.message = "Cannot find item " + slot;
                response.data = data;
                callback(null);
            }
            else if (data.Item == null) {
                response.statusCode = 404;
                response.message = "Cannot find item " + slot;
                response.data = data;
                callback(data.ItemNoArticle);
            }
            else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                response.statusCode = 200;
                response.message = "Slot retrieved: " + JSON.stringify(data);
                response.data = data;
                callback(data.ItemNoArticle);
            }
        });
    }
}
exports.LookupService = LookupService;
;
exports.lookupService = new LookupService();
//# sourceMappingURL=lookupService.js.map