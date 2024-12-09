const { InstanceBase, Regex, runEntrypoint, InstanceStatus, LogLevel } = require('@companion-module/base');
const EventEmitter = require('events');
const PlaydeckInstance = require('../index');

class PlaydeckConnection extends EventEmitter {
  /**
   * @param {PlaydeckInstance} instance
   */
  constructor(instance) {
    super();
    this.instance = instance;
    /**
     * @type { InstanceStatus }
     */
    this.status = InstanceStatus.Disconnected;
    this.data;
  }

  init() {}
  updateState() {}
  destroy() {}
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
    this.instance.log(level, message);
  }
  /**
   *
   * @param {InstanceStatus} connectionStatus sets status of connection
   * @param {boolean} isGlobal define is status global
   */
  updateStatus(connectionStatus, isGlobal = true) {
    this.status = connectionStatus;
    if (isGlobal) {
      this.instance.updateStatus(connectionStatus);
    }
  }
}

module.exports = {
  PlaydeckConnection,
};
