"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckOutgoingMessage = void 0;
class PlaydeckOutgoingMessage {
    #instance = null;
    #messageType;
    #message;
    constructor(instance, messageType, message) {
        this.#instance = instance;
        this.#message = message;
        this.#messageType = messageType;
    }
}
exports.PlaydeckOutgoingMessage = PlaydeckOutgoingMessage;
//# sourceMappingURL=PlaydeckIncomingMessage.js.map