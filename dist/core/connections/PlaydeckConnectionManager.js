"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckConnectionManager = void 0;
const PlaydeckConnection_js_1 = require("./PlaydeckConnection.js");
class PlaydeckConnectionManager {
    /**
     * Connection for sending commands
     */
    outgoing = null;
    /**
     * Connection for recieving feedbacks
     */
    incoming = null;
    /**
     * Connecton for polling data from Playdeck. (Available from 4x versions)
     */
    query = null;
    #isWSEnabled = false;
    #isEventsEnabled = false;
    #isLegacy = false;
    #instance;
    constructor(instance) {
        this.#instance = instance;
        this.#isWSEnabled = this.#instance.version?.hasConnection(PlaydeckConnection_js_1.ConnectionType.WS) === true;
        this.#isEventsEnabled =
            this.#instance.version?.hasConnection(PlaydeckConnection_js_1.ConnectionType.TCP, PlaydeckConnection_js_1.ConnectionDirection.Incoming) === true;
        this.#isLegacy = this.#instance.version?.isLegacy() === true;
        this.#init();
    }
    #init() {
        this.#log('debug', `Initializing...`);
        const incomingType = this.#getIncomingType();
        const outgoingType = this.#getOutgoingType();
        const queryType = !this.#isLegacy ? PlaydeckConnection_js_1.ConnectionType.WS : null;
        this.#log('info', `In: ${incomingType}; Out: ${outgoingType}; Query: ${queryType}`);
        this.#makeConnections(incomingType, outgoingType, queryType);
    }
    #makeConnections(incomingType, outgoingType, queryType) {
        if (outgoingType === PlaydeckConnection_js_1.ConnectionType.TCP) {
            this.outgoing = this.#makeConnection(PlaydeckConnection_js_1.ConnectionType.TCP, PlaydeckConnection_js_1.ConnectionDirection.Outgoing);
        }
        if (incomingType === PlaydeckConnection_js_1.ConnectionType.TCP) {
            this.incoming = this.#makeConnection(PlaydeckConnection_js_1.ConnectionType.TCP, PlaydeckConnection_js_1.ConnectionDirection.Incoming);
        }
        const wsConnectionDirection = (Number(outgoingType === PlaydeckConnection_js_1.ConnectionType.WS) << 0) +
            (Number(incomingType === PlaydeckConnection_js_1.ConnectionType.WS) << 1) +
            (Number(queryType === PlaydeckConnection_js_1.ConnectionType.WS) << 2);
        console.log(`${Number(outgoingType === PlaydeckConnection_js_1.ConnectionType.WS) << 0} + ${Number(incomingType === PlaydeckConnection_js_1.ConnectionType.WS) << 1} +${Number(queryType === PlaydeckConnection_js_1.ConnectionType.WS) << 2}`);
        if (wsConnectionDirection !== PlaydeckConnection_js_1.ConnectionDirection.None) {
            const WSConnection = this.#makeConnection(PlaydeckConnection_js_1.ConnectionType.WS, wsConnectionDirection);
            if (outgoingType === PlaydeckConnection_js_1.ConnectionType.WS) {
                this.outgoing = WSConnection;
            }
            if (incomingType === PlaydeckConnection_js_1.ConnectionType.WS) {
                this.incoming = WSConnection;
            }
            if (queryType === PlaydeckConnection_js_1.ConnectionType.WS) {
                this.query = WSConnection;
            }
        }
    }
    #makeConnection(type, direction) {
        this.#log('debug', `Making connection ${type} (${direction})`);
        return null;
    }
    #getIncomingType() {
        if (!this.#isEventsEnabled)
            return null;
        if (this.#instance === undefined)
            return null;
        const config = this.#instance.config;
        if (config === undefined || config == null)
            return null;
        if (config.isAdvanced) {
            if (config.isTCPEvents)
                return PlaydeckConnection_js_1.ConnectionType.TCP;
            if (this.#isWSEnabled && config.isWS)
                return PlaydeckConnection_js_1.ConnectionType.WS;
        }
        if (this.#isWSEnabled)
            return PlaydeckConnection_js_1.ConnectionType.WS;
        return PlaydeckConnection_js_1.ConnectionType.TCP;
    }
    #getOutgoingType() {
        if (this.#instance === undefined)
            return null;
        const config = this.#instance.config;
        if (config === undefined || config == null)
            return null;
        if (config.isAdvanced) {
            if (config.isTCPCommands)
                return PlaydeckConnection_js_1.ConnectionType.TCP;
            if (this.#isWSEnabled && config.isWS)
                return PlaydeckConnection_js_1.ConnectionType.WS;
        }
        if (this.#isWSEnabled)
            return PlaydeckConnection_js_1.ConnectionType.WS;
        return PlaydeckConnection_js_1.ConnectionType.TCP;
    }
    async destroy() {
        this.#log('debug', `Destroying...`);
        if (this.incoming)
            this.incoming.destroy();
        if (this.outgoing)
            this.outgoing.destroy();
        if (this.query)
            this.query.destroy();
    }
    #log(level, message) {
        this.#instance?.log(level, `Playdeck Connection Manager: ${message}`);
    }
}
exports.PlaydeckConnectionManager = PlaydeckConnectionManager;
//# sourceMappingURL=PlaydeckConnectionManager.js.map