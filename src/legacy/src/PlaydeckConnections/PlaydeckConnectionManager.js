const PlaydeckInstance = require('../../index');
const { InstanceStatus, LogLevel } = require('@companion-module/base');
const { PlaydeckConnection, ConnectionType, ConnectionDirection } = require('./PlaydeckConnection');
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
    let incomingType = this.#getIncomingType();
    /** @type { ConnectionType } */
    let outgoingType = this.#getOutgoingType();
    if (outgoingType === ConnectionType.WS && outgoingType === incomingType) {
      this.outgoing = this.#startConnection(outgoingType, ConnectionDirection.BiDirectional);
      this.incoming = this.outgoing;
    } else {
      this.outgoing = this.#startConnection(outgoingType, ConnectionDirection.Outgoing);
      this.incoming = this.#startConnection(incomingType, ConnectionDirection.Incoming);
    }

    this.#log(`info`, `Incoming = ${this.incoming ? this.incoming.type : `EMPTY`}, Outgoing = ${this.outgoing ? this.outgoing.type : `EMPTY`}`);
  }
  /** @returns {ConnectionType | null}  */
  #getIncomingType() {
    if (!this.#instance.version.isTCPEventsAvailable()) {
      this.#log('error', `Version ${this.#instance.version.getCurrent()} doesn't support ANY incoming connection. No feedbacks and variables will be available.`);
      return null;
    }
    const incomingType = this.#instance.config.isTCPEvents ? ConnectionType.TCP : ConnectionType.WS;
    if (incomingType === ConnectionType.TCP) return ConnectionType.TCP;
    if (this.#instance.version.isWebsoketAvailable() && incomingType === ConnectionType.WS) return ConnectionType.WS;

    this.#log(
      'error',
      `Version ${this.#instance.version.getCurrent()} doesn't support incoming ${incomingType} connection! module will ignore it. No feedbacks and variables will be available.`
    );
    return null;
  }
  /** @returns {ConnectionType | null}  */
  #getOutgoingType() {
    const outgoingType = this.#instance.config.isTCPCommands ? ConnectionType.TCP : ConnectionType.WS;

    if (outgoingType === ConnectionType.TCP) {
      return ConnectionType.TCP;
    }

    if (this.#instance.version.isWebsoketAvailable()) {
      if (outgoingType === ConnectionType.WS) {
        return ConnectionType.WS;
      }
    } else {
      if (outgoingType === ConnectionType.WS) {
        const errorMessage = `Version ${this.#instance.version.getCurrent()} doesn't support outgoing WebSocket connection, please turn ON and setup TCP Connection!`;
        this.updateStatus(InstanceStatus.ConnectionFailure, errorMessage);
        this.#log('error', errorMessage);
      }
    }
    return null;
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
      default:
        return null;
    }
  }
  destroy() {
    if (this.outgoing) {
      this.outgoing.destroy();
      if (this.outgoing.direction === 'bidirectional') return;
    }
    if (this.incoming) {
      this.incoming.destroy();
    }
  }
  /**
   * @param {LogLevel} level
   * @param  {string} message
   */
  #log(level, message) {
    this.#instance.log(level, `Playdeck Connection Manager: ${message}`);
  }
  /**
   *
   * @param {InstanceStatus} connectionStatus sets status of connection
   * @param { string } message optional message for status
   */
  updateStatus(connectionStatus, message) {
    this.#instance.updateStatus(connectionStatus, message ? message : null);
  }
}

module.exports = {
  PlaydeckConnectionManager,
};
