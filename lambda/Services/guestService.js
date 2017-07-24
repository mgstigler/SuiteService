'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
let https = require("https");
class GuestService {
    getGuestInformation(deviceId, callback) {
        let parsedData = null;
        let url = 'https://plocf3fmt2.execute-api.us-east-1.amazonaws.com/dev/room?AlexaId=' + deviceId;
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
                        console.info("HERE");
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
exports.GuestService = GuestService;
exports.guestService = new GuestService();
//# sourceMappingURL=guestService.js.map