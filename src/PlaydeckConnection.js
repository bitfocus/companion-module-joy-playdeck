const { InstanceBase, Regex, runEntrypoint, InstanceStatus, LogLevel } = require('@companion-module/base');
const EventEmitter = require('events');
const dns = require('dns');
const PlaydeckInstance = require('../index');
const { PlaybackState, ClipType, ConnectionType, ConnectionDirection } = require('./PlaydeckConstants');
/**
 * PlaydeckConnection class
 *
 * @extends EventEmitter
 */
class PlaydeckConnection extends EventEmitter {
  /** @type { number } */
  #reconnectTimeout = 5000;
  /**
   * @protected
   * @type { PlaydeckInstance }
   */
  _instance;
  /**
   * @protected
   * @type { number }
   */
  _port;
  /**
   * @protected
   * @type { string }
   */
  _host;
  /**
   * @protected
   *  @type { string }
   */
  _lastErrorMessage;
  /** @type { ConnectionDirection } */
  direction;
  /** @type { ConnectionType } */
  type;
  /** @type { InstanceStatus } */
  status;
  /**
   * @param {PlaydeckInstance} instance
   * @param {ConnectionDirection} direction
   * */
  constructor(instance, direction) {
    super();
    this._instance = instance;
    this.direction = direction;
    this.status = InstanceStatus.Disconnected;
  }
  /** @protected */
  _init() {}
  /**
   * Returns promise with IPv4 adress of host: `{ address: string, family: 4 }`
   * @protected
   * @param { string } host
   * @returns { Promise<dns.LookupAddress> }
   */
  _resolveHost(host) {
    return dns.promises.lookup(host, 4);
  }
  /** @protected */
  _reconnect() {
    this.updateStatus(InstanceStatus.Connecting, this._lastErrorMessage ? `Last error: ${this._lastErrorMessage}` : null);
    setTimeout(() => {
      this.destroy();
      this.log('info', `Trying to reconnect...`);
      this._init();
    }, this.#reconnectTimeout);
  }
  /**
   * @type {{
   * (event: 'message', dataCall: (data: string) => void) => PlaydeckConnection;
   * (event: 'error', errCall: (err: Error) => void ) => PlaydeckConnection;
   * }}
   */
  on = (event, ...args) => {
    return super.on(event, ...args);
  };
  // this is for me not to forget how to JS Doc event emitter stuff
  /**
   * @type {{
   * (event: 'message', data: string)=> boolean;
   * (event: 'error', err: Error )=> boolean;
   * }}
   */
  emit = (event, ...args) => {
    return super.emit(event, ...args);
  };
  /**
   *
   * @param { string } command Command like <{command}|{playlistID}|{blockID}|{clipID}>
   */
  send(command) {}

  /**
   *
   * @param {LogLevel} level
   * @param  {string} message
   */
  log(level, message) {
    this._instance.log(level, `Playdeck ${this.type} (${this.direction}): ${message}`);
  }
  /**
   *
   * @param {InstanceStatus} connectionStatus sets status of connection
   * @param { string } message optional message for status
   * @param {boolean} isGlobal define is status global
   */
  updateStatus(connectionStatus, message, isGlobal = true) {
    this.status = connectionStatus;
    if (isGlobal) {
      this._instance.updateStatus(connectionStatus, message ? message : null);
    }
  }
}

module.exports = {
  PlaydeckConnection,
};
