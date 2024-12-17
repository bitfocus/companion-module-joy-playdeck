const { InstanceStatus, TCPHelper, InstanceBase, LogLevel } = require('@companion-module/base');
const { PlaydeckConnection } = require('./PlaydeckConnection');
const dns = require('dns');
const PlaydeckInstance = require('../index');
const { PlaybackState, ClipType, ConnectionType, ConnectionDirection } = require('./PlaydeckConstants');
const { PlaydeckRCEventMessage } = require(`./PlaydeckRCEventMessage`);

class PlaydeckTCPConnection extends PlaydeckConnection {
  /** @type { PlaydeckWSStateValues | null } */
  #stateValues = null;
  /** @type { NodeJS.Timeout | null} */
  #reconnectInterval = null;
  /** @type { number | null }  */
  #reconnectTimeout = 5000;
  /** @type { string | null } */
  #lastErrorMessage = null;
  /** @type { TCPHelper | null} */
  #tcpHelper = null;
  /** @type { number } */
  #port;
  /** @type { string } */
  #host;
  /**
   * @param { PlaydeckInstance } instance
   *  @param { ConnectionDirection }
   */
  constructor(instance, direction) {
    super(instance, direction);
    this.type = ConnectionType.TCP;

    switch (this.direction) {
      case ConnectionDirection.Incoming:
        this.#port = this._instance.config.tcpPortEv;
        break;
      case ConnectionDirection.Outgoing:
        this.#port = this._instance.config.tcpPortCom;
        break;
    }

    this.#resolveHost(this._instance.config.host).then((lookupResult) => {
      this.#host = lookupResult.address;
      this.log(`info`, `Starting. IP/HOST: ${this.#host}. PORT: ${this.#port}`);
      this.#init();
    });
  }
  #init() {
    this.updateStatus(InstanceStatus.Connecting);
    this.#tcpHelper = new TCPHelper(this.#host, this.#port);
    this.#tcpHelper.on('status_change', (status, message) => {
      this.log('debug', `TCP (${this.direction}) socket - Status: ${status}${message ? ' - Message: ' + message : ''}`);
      this.updateStatus(status);
      switch (status) {
        case InstanceStatus.Ok:
          this.log('info', `TCP (${this.direction}) connection established.`);
          break;
      }
    });
  }
  #resolveHost(host) {
    return dns.promises.lookup(host, 4);
  }
  /**
   *
   * @param {string} data
   */
  #dataHandler(data) {}
  /**
   *
   * @param { StatusMessage } sMessage
   */
  #handleStatus(sMessage) {}
  #reconnect() {}
  /**
   * @param { string } command
   * @override
   */
  send(command) {}
  /**
   * @override
   */
  destroy() {
    this.log(`debug`, `Playdeck TCP (${this.direction}) Connection destroyed.`);
  }
}

module.exports = {
  PlaydeckTCPConnection,
};
