"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckConnectionManager = void 0;
class PlaydeckConnectionManager {
    outgoing;
    incoming;
    #instance;
    constructor(instance) {
        this.#instance = instance;
        this.#init();
    }
    #init() {
        this.#log('debug', `Initializing...`);
        const incomingType = this.#getIncomingType();
        const outgoingType = this.#getOutgoingType();
        this.#log('info', `In: ${incomingType}; Out: ${outgoingType}`);
        // this.#log(
        // 	`info`,
        // 	`Incoming = ${this.incoming ? this.incoming.type : `EMPTY`}, Outgoing = ${this.outgoing ? this.outgoing.type : `EMPTY`}`,
        // )
    }
    #getIncomingType() {
        return null;
    }
    #getOutgoingType() {
        return null;
    }
    destroy() {
        this.#log('debug', `Destroying...`);
    }
    #log(level, message) {
        this.#instance?.log(level, `Playdeck Connection Manager: ${message}`);
    }
}
exports.PlaydeckConnectionManager = PlaydeckConnectionManager;
//# sourceMappingURL=PlaydeckConnectionManager.js.map