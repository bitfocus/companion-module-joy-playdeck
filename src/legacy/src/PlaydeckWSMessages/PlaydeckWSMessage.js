const PlaydeckInstance = require('../../index');
const { LogLevel, InstanceStatus } = require('@companion-module/base');
const { PlaydeckWSStateValues } = require('./PlaydeckWSStateValues/PlaydeckWSStateValues');

class PlaydeckWSMessage {
  /**
   * @protected
   * @type { PlaydeckInstance }
   */
  _instance;
  /**
   * @type { PlaydeckWSStateValues }
   */

  #stateValues = null;
  /**
   * @constructor
   * @param { PlaydeckInstance } instance
   * @param { string } message
   */

  constructor(instance, message) {
    this._instance = instance;
    this.#stateValues = PlaydeckWSStateValues.getStateValues(this._instance.version);
    this.#handleStatus(message);
  }
  #handleStatus(sMessage) {
    const values = new this.#stateValues(sMessage).getValues();

    if (values === null) {
      this._instance.updateStatus(InstanceStatus.BadConfig, 'Check version!');
      this._log('warn', 'Cannot read message, maybe version mismatch!');
    }
    this._instance.state.updateValues(values);
  }
  /**
   * @protected
   * @param {LogLevel} level
   * @param  {string} message
   */
  _log(level, message) {
    this._instance.log(level, `Playdeck WS: ${message}`);
  }
}

module.exports = {
  PlaydeckWSMessage,
};
