'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
let docClient = new AWS.DynamoDB.DocumentClient();
class AmenityService {
    //Function returns hours and location for the amenity
    getAmenity(amenity, callback) {
        let params = {
            TableName: "Amenities",
            IndexName: "Amenity-index",
            KeyConditionExpression: "Amenity = :a",
            ExpressionAttributeValues: {
                ":a": amenity
            }
        };
        let response = {
            statusCode: 200,
            message: ""
        };
        docClient.query(params, function (err, data) {
            console.info(data);
            console.info(JSON.stringify(data));
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("Query succeeded.");
                data.Items.forEach(function (item) {
                    console.info("Amenity Info" + JSON.stringify(item));
                    response.message = JSON.stringify(item);
                    callback(item);
                });
            }
        });
    }
    getStandardTime(openingHour, closingHour, callback) {
        let StandardTime = {
            openingTime: "",
            closingTime: ""
        };
        let openingStandard = openingHour == 12 || openingHour == 24 ? 12 : openingHour % 12;
        let openingMeridian = openingHour >= 12 && openingHour != 24 ? "P.M." : "A.M.";
        let closingStandard = closingHour == 12 || closingHour == 24 ? 12 : closingHour % 12;
        let closingMeridian = closingHour >= 12 && closingHour != 24 ? "P.M." : "A.M.";
        StandardTime.openingTime = openingStandard + " " + openingMeridian;
        StandardTime.closingTime = closingStandard + " " + closingMeridian;
        callback(StandardTime);
    }
}
exports.AmenityService = AmenityService;
;
exports.amenityService = new AmenityService();
//# sourceMappingURL=amenityService.js.map