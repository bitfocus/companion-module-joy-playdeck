"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaydeckWSConnection = void 0;
const base_1 = require("@companion-module/base");
const PlaydeckConnection_js_1 = require("./PlaydeckConnection.js");
class PlaydeckWSConnection extends PlaydeckConnection_js_1.PlaydeckConnection {
    port = 11411;
    #webSocket;
    constructor(instance, direction) {
        super(instance, direction);
        this.type = PlaydeckConnection_js_1.ConnectionType.WS;
        if (this.instance?.config.host) {
            this.resolveHostToIPV4(this.instance?.config.host ?? ``)
                .then((resolvedHost) => {
                this.host = resolvedHost.address;
                if (this.instance?.config.isAdvanced) {
                    if (typeof this.instance?.config.wsPort === 'number') {
                        this.port = this.instance?.config.wsPort;
                    }
                    else {
                        this.updateStatus(base_1.InstanceStatus.BadConfig, `Port is not a number`, true);
                    }
                }
                this.init();
            })
                .catch((e) => {
                this.log('error', `Resolving host: ${e}`);
                this.updateStatus(base_1.InstanceStatus.BadConfig, `Cannot resolve host`, true);
            });
        }
        else {
            this.updateStatus(base_1.InstanceStatus.BadConfig, `Check config!`, true);
        }
    }
    init() {
        const wsURL = `ws://${this.host}:${this.port}`;
        this.updateStatus(base_1.InstanceStatus.Connecting, `Connecting to WebSockets: ${wsURL}`, true);
        if (this.#webSocket) {
            this.destroy();
        }
        try {
            this.#webSocket = new WebSocket(wsURL);
            this.#webSocket.onopen = this.#onopen.bind(this);
            this.#webSocket.onerror = this.#onerror.bind(this);
            this.#webSocket.onclose = this.#onclose.bind(this);
            this.#webSocket.onmessage = this.#onmessage.bind(this);
        }
        catch (error) {
            this.log('error', `WebSocket initialization error: ${error}`);
            this.reconnect();
        }
    }
    #onmessage(message) {
        const messageData = message.data;
        const wsMessage = this.#getMessage(messageData);
        if (wsMessage !== null) {
            switch (wsMessage.type) {
                case WSMessageType.Event:
                    this.log(`debug`, `Recieved Event: ${wsMessage.data}`); // don't know what it means it returns {"AnyVariableName":"1"}
                    break;
                case WSMessageType.Status:
                    break;
                case WSMessageType.Project:
                    this.log(`debug`, `Recieved Project: ${wsMessage.data}`); // don't know what it means it returns {"AnyVariableName":"1"}
                    break;
                case WSMessageType.Premanent:
                    this.log(`debug`, `Recieved Permanent: ${wsMessage.data}`); // don't know what it means it returns {"AnyVariableName":"1"}
                    break;
            }
        }
    }
    #getMessage(wsMessageText) {
        if (wsMessageText.indexOf('|') === -1) {
            this.log(`debug`, `Recieved non properly formatted message: ${wsMessageText}`);
            return null;
        }
        const dataArray = wsMessageText.split(`|`);
        const sType = dataArray.shift();
        const sData = dataArray.join('|');
        return {
            type: sType,
            data: sData,
        };
    }
    #onopen() {
        this.log('debug', `Opened`);
        this.updateStatus(base_1.InstanceStatus.Ok);
        this.updateStatus(base_1.InstanceStatus.Ok, `Connected to Playdeck via WebSockets`, this.instance?.connectionManager?.isAllConnected());
    }
    #onclose(event) {
        this.log('debug', `Closed with code: ${event.code}, resason: ${event.reason}`);
        this.reconnect();
    }
    #onerror(error) {
        this.log('error', `WebSocket error: ${error.message}`);
        this.lastErrorMessage = error.message;
        this.updateStatus(base_1.InstanceStatus.UnknownError, this.lastErrorMessage, true);
        if (this.#webSocket.readyState !== WebSocket.OPEN) {
            this.reconnect();
        }
    }
    send(message) {
        this.log('debug', `Sending message: ${message}`);
        if (this.#webSocket?.send) {
            this.#webSocket.send(message);
        }
    }
    destroy() {
        this.log('debug', `Destroying...`);
        if (this.#webSocket) {
            this.#webSocket.onopen = null;
            this.#webSocket.onerror = null;
            this.#webSocket.onclose = null;
            this.#webSocket.onmessage = null;
            if (this.#webSocket.readyState === WebSocket.OPEN || this.#webSocket.readyState === WebSocket.CONNECTING) {
                this.#webSocket.close(1000, 'Cleaning up previous connection');
            }
            this.#webSocket = null;
        }
    }
}
exports.PlaydeckWSConnection = PlaydeckWSConnection;
var WSMessageType;
(function (WSMessageType) {
    WSMessageType["Event"] = "event";
    WSMessageType["Status"] = "status";
    WSMessageType["Project"] = "project";
    WSMessageType["Premanent"] = "permanent";
})(WSMessageType || (WSMessageType = {}));
//# sourceMappingURL=PlaydeckWSConnection.js.map