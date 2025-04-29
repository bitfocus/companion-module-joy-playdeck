const { InstanceStatus } = require('@companion-module/base');
const WebSocket = require('ws');
const { PlaydeckConnection, ConnectionType, ConnectionDirection } = require('./PlaydeckConnection');
const PlaydeckInstance = require('../../index');
const { PlaydeckRCEventMessage } = require(`../PlaydeckRCMessages/PlaydeckRCEventMessage`);
const { PlaydeckWSMessage } = require(`../PlaydeckWSMessages/PlaydeckWSMessage`);

class PlaydeckWSConnection extends PlaydeckConnection {
  /** @type { WebSocket | null} */
  #webSocket = null;

  /**
   * @param { PlaydeckInstance } instance
   * @param { ConnectionDirection } direction
   *
   */
  constructor(instance, direction) {
    super(instance, direction);
    this.type = ConnectionType.WS;
    this._port = this._instance.config.wsPort;
    this._host = this._instance.config.host;
    this._log(`info`, `Starting connection. IP/HOST: ${this._host}. PORT: ${this._port}`);
    this._init();
  }
  _init() {
    this._updateStatus(InstanceStatus.Connecting);
    this.#webSocket = new WebSocket(`ws://${this._host}:${this._port}`);
    this.#webSocket.on('open', () => {
      this._log(`info`, `Connected.`);
      this._updateStatus(InstanceStatus.Ok);
      this._lastErrorMessage = null;
    });
    this.#webSocket.on('message', (rawData, isBinary) => {
      if (!isBinary) {
        this.#dataHandler(rawData.toString());
      }
    });
    this.#webSocket.on('error', (err) => {
      this._log('error', `Error: ${err.message}`);
      this._lastErrorMessage = err.message;
      this._updateStatus(InstanceStatus.ConnectionFailure, this._lastErrorMessage);
    });
    this.#webSocket.on('close', (code, reason) => {
      this._log('debug', `Closed with code: ${code}, with reason: ${reason.toString()}`);
      this._reconnect();
    });
  }
  /**
   *
   * @param {string} data
   */
  #dataHandler(data) {
    if (data.indexOf(`|`) == -1) {
      this._log(`debug`, `Recieved non properly formatted message: ${data}`);
      return;
    }
    const dataArray = data.split(`|`);
    /** 
      @constant
      @type {'event' | 'status' | 'permanent' }
    */
    const sType = dataArray.shift();
    const sData = dataArray.join('|');
    switch (sType) {
      case 'event':
        const newEvent = new PlaydeckRCEventMessage(this._instance, `<${sData}>`);
        break;
      case 'status':
        const newWSMessage = new PlaydeckWSMessage(this._instance, JSON.parse(sData));
        break;
      case 'permanent':
        this._log(`debug`, `Recieved permanent: ${sData}`); // don't know what it means it returns {"AnyVariableName":"1"}
        break;
    }
  }
  /**
   * @param { string } command
   * @override
   */
  send(command) {
    this._log('debug', `Message sent: ${command}`);
    this.#webSocket.send(command);
  }
  /**
   * @override
   */
  destroy() {
    this.#webSocket.close(1000);
    this._log(`debug`, `Connection destroyed.`);
  }
}

module.exports = {
  PlaydeckWSConnection,
};
