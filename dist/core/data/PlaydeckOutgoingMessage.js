"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckOutgoingMessage = void 0;
class PlaydeckOutgoingMessage {
    #instance = null;
    #sender = null;
    constructor(instance, message) {
        this.#instance = instance;
        this.#sender = this.#instance?.connectionManager?.outgoing;
        if (this.#sender) {
            this.#sender.send(message);
        }
    }
}
exports.PlaydeckOutgoingMessage = PlaydeckOutgoingMessage;
//# sourceMappingURL=PlaydeckOutgoingMessage.js.map