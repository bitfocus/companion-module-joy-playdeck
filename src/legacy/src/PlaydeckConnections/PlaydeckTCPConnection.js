const PlaydeckInstance = require('../../index');
const { InstanceStatus, TCPHelper } = require('@companion-module/base');
const { PlaydeckConnection, ConnectionType, ConnectionDirection } = require('./PlaydeckConnection');
const { PlaydeckRCEventMessage } = require(`../PlaydeckRCMessages/PlaydeckRCEventMessage`);
const { PlaydeckVersion } = require('../PlaydeckVersion');

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
      this._log(`info`, `Starting. IP/HOST: ${this._host}. PORT: ${this._port}`);
      this._init();
    });
  }
  _init() {
    this._updateStatus(InstanceStatus.Connecting);
    this.#tcpHelper = new TCPHelper(this._host, this._port, { reconnect: false });
    this.#tcpHelper.on('status_change', (status, message) => {
      this._log('debug', `TCP (${this.direction}) socket - Status: ${status}${message ? ' - Message: ' + message : ''}`);
      this._updateStatus(status);
      switch (status) {
        case InstanceStatus.Ok:
          this._log('info', `Connection established.`);
          break;
        case InstanceStatus.Disconnected:
          this._log('warn', `TCP (${this.direction}) Disconnected.`);
          this._reconnect();
          break;
      }
      this.#tcpHelper.on('data', (data) => {
        this.#dataHandler(data.toString().replace(/[\r\n]+/gm, '')); // Events come with linebrake in the end of message
      });

      this.#tcpHelper.on('error', (err) => {
        this._log('error', `Error: ${err.message}`);
        this._lastErrorMessage = err.message;
        this._updateStatus(InstanceStatus.ConnectionFailure, this._lastErrorMessage);
        if (!this.#tcpHelper.isConnected) {
          this._reconnect();
        }
      });
    });
  }

  /** @param {string} data */
  #dataHandler(data) {
    this._log('debug', `Recieved data: ${data}`);
    const dataLowCase = data.toLocaleLowerCase();
    if (dataLowCase.startsWith('playdeck')) {
      const recivedVersion = dataLowCase.split('playdeck ')[1];
      if (PlaydeckVersion.isVersion(recivedVersion)) {
        this._log('debug', `Recieved version info: ${recivedVersion}`);
        if (recivedVersion !== this._instance.version.getCurrent()) {
          this._log('warn', `Connected to different version of Playdeck (${recivedVersion}). Check settings (${this._instance.version.getCurrent()})!`);
        }
      }
    } else {
      const newEvent = new PlaydeckRCEventMessage(this._instance, data);
    }
  }

  /**
   * @param { string } command
   * @override
   */
  send(command) {
    this._log('debug', `Message sent: ${command}`);
    this.#tcpHelper.send(command);
  }
  /** @override */
  destroy() {
    this._log(`debug`, `Connection destroyed.`);
    this.#tcpHelper.destroy();
  }
}

module.exports = {
  PlaydeckTCPConnection,
};
