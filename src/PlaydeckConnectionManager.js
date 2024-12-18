const EventEmitter = require('events');
const { InstanceStatus, TCPHelper, InstanceBase, LogLevel } = require('@companion-module/base');
const WebSocket = require('ws');
const { isBigInt64Array } = require('util/types');
const { PlaydeckConnection } = require('./PlaydeckConnection');
const { PlaydeckStateParameter } = require('./PlaydeckTypes');
const PlaydeckInstance = require('../index');
const { PlaybackState, ClipType, ConnectionType, ConnectionDirection } = require('./PlaydeckConstants');
const { PlaydeckRCEventMessage } = require(`./PlaydeckRCEventMessage`);
const { PlaydeckWSConnection } = require('./PlaydeckWSConnection');
const { PlaydeckTCPConnection } = require('./PlaydeckTCPConnection');
class PlaydeckConnectionManager {
  /** @type { PlaydeckConnection} */
  outgoing;
  /** @type { PlaydeckConnection} */
  incoming;
  /** @type { PlaydeckInstance } */
  #instance;
  /** @param { PlaydeckInstance } instance */
  constructor(instance) {
    this.#instance = instance;
    this.#init();
  }
  #init() {
    /** @type { ConnectionType } */
    let incomingType = null;
    /** @type { ConnectionType } */
    let outgoingType = null;
    outgoingType = this.#instance.config.isTCPCommands ? ConnectionType.TCP : ConnectionType.WS;
    incomingType = this.#instance.config.isTCPEvents ? ConnectionType.TCP : ConnectionType.WS;
    if (outgoingType === ConnectionType.WS && outgoingType === incomingType) {
      this.outgoing = this.#startConnection(outgoingType, ConnectionDirection.BiDirectional);
      this.incoming = this.outgoing;
    } else {
      this.outgoing = this.#startConnection(outgoingType, ConnectionDirection.Outgoing);
      this.incoming = this.#startConnection(incomingType, ConnectionDirection.Incoming);
    }
    this.log(`info`, `Incoming = ${this.incoming.type}, Outgoing = ${this.outgoing.type}`);
  }
  /**
   *
   * @param { ConnectionType } connectionType
   * @param { ConnectionDirection } direction
   * @returns { PlaydeckConnection }
   */
  #startConnection(connectionType, direction) {
    switch (connectionType) {
      case ConnectionType.WS:
        return new PlaydeckWSConnection(this.#instance, direction);
      case ConnectionType.TCP:
        return new PlaydeckTCPConnection(this.#instance, direction);
    }
  }

  /**
   * @param {LogLevel} level
   * @param  {string} message
   */
  log(level, message) {
    this.#instance.log(level, `Playdeck Connection Manager: ${message}`);
  }
}

module.exports = {
  PlaydeckConnectionManager,
};
