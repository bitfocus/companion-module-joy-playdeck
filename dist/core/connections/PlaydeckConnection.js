"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckConnection = exports.ConnectionType = exports.ConnectionDirection = void 0;
const base_1 = require("@companion-module/base");
const events_1 = __importDefault(require("events"));
const dns_1 = __importDefault(require("dns"));
/**
 * Direction binary mask
| DIRECTION     | Query | In  | Out | RESULT |
| ------------- | ----- | --- | --- | ------ |
| None          | 0     | 0   | 0   | **0**  |
| Outgoing      | 0     | 0   | 1   | **1**  |
| Incoming      | 0     | 1   | 0   | **2**  |
| BiDirectional | 0     | 1   | 1   | **3**  |
| Query         | 1     | 0   | 0   | **4**  |
| QueryOut      | 1     | 0   | 1   | **5**  |
| QueryIn       | 1     | 1   | 0   | **6**  |
| All           | 1     | 1   | 1   | **7**  |
 */
var ConnectionDirection;
(function (ConnectionDirection) {
    ConnectionDirection[ConnectionDirection["None"] = 0] = "None";
    ConnectionDirection[ConnectionDirection["Outgoing"] = 1] = "Outgoing";
    ConnectionDirection[ConnectionDirection["Incoming"] = 2] = "Incoming";
    ConnectionDirection[ConnectionDirection["BiDirectional"] = 3] = "BiDirectional";
    ConnectionDirection[ConnectionDirection["Query"] = 4] = "Query";
    ConnectionDirection[ConnectionDirection["QueryOut"] = 5] = "QueryOut";
    ConnectionDirection[ConnectionDirection["QueryIn"] = 6] = "QueryIn";
    ConnectionDirection[ConnectionDirection["All"] = 7] = "All";
})(ConnectionDirection || (exports.ConnectionDirection = ConnectionDirection = {}));
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["TCP"] = "TCP";
    ConnectionType["WS"] = "WebSocket";
})(ConnectionType || (exports.ConnectionType = ConnectionType = {}));
class PlaydeckConnection extends events_1.default {
    #reconnectTimeout = 5000;
    instance;
    port;
    host;
    lastErrorMessage;
    direction;
    type;
    status;
    constructor(instance, direction) {
        super();
        this.instance = instance;
        this.direction = direction;
        this.status = base_1.InstanceStatus.Disconnected;
    }
    init() {
        this.log('debug', `Initializing ${this.type} (${this.direction}) conneciton`);
    }
    reconnect() {
        this.updateStatus(base_1.InstanceStatus.Connecting, this.lastErrorMessage ? `Last error: ${this.lastErrorMessage}` : null);
        setTimeout(() => {
            this.destroy();
            this.log('info', `Trying to reconnect...`);
            this.init();
        }, this.#reconnectTimeout);
    }
    /**
     * Sends command to Playdeck
     * @param { string } command Command like `<{command}|{playlistID}|{blockID}|{clipID}>`
     */
    send(command) {
        this.log('debug', `Sending ${command}`);
    }
    destroy() {
        this.log('debug', `Destroying ${this.type} (${this.direction}) conneciton`);
    }
    /**
     * Returns promise with IPv4 adress of host: `{ address: string, family: 4 }`
     * @param { string } host
     * @returns { Promise<dns.LookupAddress> }
     */
    async resolveHostToIPV4(host) {
        return dns_1.default.promises.lookup(host, 4);
    }
    log(level, message) {
        this.instance?.log(level, `Playdeck ${this.type} (${this.direction}): ${message}`);
    }
    updateStatus(connectionStatus, message, isGlogal) {
        this.status = connectionStatus;
        if (isGlogal && this.instance !== undefined) {
            this.instance.updateStatus(connectionStatus, message ? message : null);
        }
    }
}
exports.PlaydeckConnection = PlaydeckConnection;
//# sourceMappingURL=PlaydeckConnection.js.map