"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckConnection = exports.ConnectionType = exports.ConnectionDirection = void 0;
const events_1 = __importDefault(require("events"));
var ConnectionDirection;
(function (ConnectionDirection) {
    ConnectionDirection["Incoming"] = "incoming";
    ConnectionDirection["Outgoing"] = "outgoing";
    ConnectionDirection["BiDirectional"] = "bidirectional";
})(ConnectionDirection || (exports.ConnectionDirection = ConnectionDirection = {}));
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["TCP"] = "TCP";
    ConnectionType["WS"] = "WebSocket";
})(ConnectionType || (exports.ConnectionType = ConnectionType = {}));
class PlaydeckConnection extends events_1.default {
    constructor(instance, direction) {
        super();
    }
}
exports.PlaydeckConnection = PlaydeckConnection;
//# sourceMappingURL=PlaydeckConnection.js.map