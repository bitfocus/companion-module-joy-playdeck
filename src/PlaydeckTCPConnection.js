const { InstanceStatus, TCPHelper, InstanceBase, LogLevel } = require('@companion-module/base');
const { PlaydeckConnection } = require('./PlaydeckConnection');

const PlaydeckInstance = require('../index');
const { PlaybackState, ClipType, ConnectionType, ConnectionDirection } = require('./PlaydeckConstants');
const { PlaydeckRCEventMessage } = require(`./PlaydeckRCEventMessage`);

class PlaydeckTCPConnection extends PlaydeckConnection {
  #stateValues = null;
  /** @type { TCPHelper | null} */
  #tcpHelper = null;

  /**
   * @param { PlaydeckInstance } instance
   * @param { ConnectionDirection } direction
   */
  constructor(instance, direction) {
    super(instance, direction);
    this.type = ConnectionType.TCP;

    switch (this.direction) {
      case ConnectionDirection.Incoming:
        this._port = this._instance.config.tcpPortEvents;
        break;
      case ConnectionDirection.Outgoing:
        this._port = this._instance.config.tcpPortCommands;
        break;
    }
    this._resolveHost(this._instance.config.host).then((lookupResult) => {
      this._host = lookupResult.address;
      this.log(`info`, `Starting. IP/HOST: ${this._host}. PORT: ${this._port}`);
      this._init();
    });
  }
  _init() {
    this.updateStatus(InstanceStatus.Connecting);
    this.#tcpHelper = new TCPHelper(this._host, this._port, { reconnect: false });
    this.#tcpHelper.on('status_change', (status, message) => {
      this.log('debug', `TCP (${this.direction}) socket - Status: ${status}${message ? ' - Message: ' + message : ''}`);
      this.updateStatus(status);
      switch (status) {
        case InstanceStatus.Ok:
          this.log('info', `Connection established.`);
          break;
        case InstanceStatus.Disconnected:
          this.log('warn', `TCP (${this.direction}) Disconnected.`);
          this._reconnect();
          break;
      }
      this.#tcpHelper.on('data', (data) => {
        this.#dataHandler(data.toString().replace(/[\r\n]+/gm, '')); // Events come with linebrake in the end of message
      });

      this.#tcpHelper.on('error', (err) => {
        this.log('error', `Error: ${err.message}`);
        this._lastErrorMessage = err.message;
        this.updateStatus(InstanceStatus.ConnectionFailure, this._lastErrorMessage);
        if (!this.#tcpHelper.isConnected) {
          this._reconnect();
        }
      });
    });
  }

  /** @param {string} data */
  #dataHandler(data) {
    this.log('debug', `Recieved data: ${data}`);
    const newEvent = new PlaydeckRCEventMessage(this._instance, data);
  }

  /**
   * @param { string } command
   * @override
   */
  send(command) {
    this.#tcpHelper.send(command);
  }
  /** @override */
  destroy() {
    this.log(`debug`, `Playdeck TCP (${this.direction}) Connection destroyed.`);
    this.#tcpHelper.destroy();
  }
}

module.exports = {
  PlaydeckTCPConnection,
};
