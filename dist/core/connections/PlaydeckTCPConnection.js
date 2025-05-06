"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckTCPConnection = void 0;
const PlaydeckConnection_js_1 = require("./PlaydeckConnection.js");
class PlaydeckTCPConnection extends PlaydeckConnection_js_1.PlaydeckConnection {
    constructor(instance, direction) {
        super(instance, direction);
        this.type = PlaydeckConnection_js_1.ConnectionType.TCP;
        this.init();
    }
}
exports.PlaydeckTCPConnection = PlaydeckTCPConnection;
//# sourceMappingURL=PlaydeckTCPConnection.js.map