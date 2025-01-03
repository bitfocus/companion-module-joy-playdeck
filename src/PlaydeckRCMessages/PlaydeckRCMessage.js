const PlaydeckInstance = require('../../index');
const { LogLevel } = require('@companion-module/base');
class PlaydeckRCMessage {
  /**
   * @protected
   * @type { PlaydeckInstance }
   */
  _instance;
  /**
   * @protected
   * @type { string }
   */
  _message;
  /**
   * @constructor
   * @param { PlaydeckInstance } instance
   * @param { string } message
   */
  constructor(instance, message) {
    this._instance = instance;
    this._message = message;
  }

  static REGEX = /^<[\w\-]+(?:\|[0-9]+){0,3}>$/;
  static REGEX_WITH_VARS = /^<[\w\-]+(?:\|[\w\-\$\(\:\)]+){0,3}>$/;
  static GLOBAL_REGEX = /\<(.*?)\>/;
  /**
   * Check if string is seems like Playdeck Command/Event
   * @param { string } message
   * @returns { boolean }
   */
  static isCorrect(message) {
    return this.REGEX.test(message);
  }
  /**
   *
   * @param { string } message
   * @param { number[] } args
   * @returns
   */
  static makeMessage(message, args) {
    if (!message) return null;
    if (!Array.isArray(args)) return `<${message}>`;
    for (let i = 0; i < args.length; i++) {
      if (!args[i]) return `<${message}>`;
      message = `${message}|${args[i]}`;
    }
    return `<${message}>`;
  }
  /**
   *
   * @param { string } messageString
   * @returns { RCMessage | null }
   */
  static parseMessage(messageString) {
    if (!this.isCorrect(messageString)) return null;
    let array = messageString.match(this.GLOBAL_REGEX)[1].split(`|`);
    return {
      message: array.shift(),
      arguments: array.map(Number),
    };
  }
  /**
   * @protected
   * @param {LogLevel} level
   * @param  {string} message
   */
  _log(level, message) {
    this._instance.log(level, `Playdeck RC: ${message}`);
  }
}

/**
 * @typedef {{ message: string | null, arguments: number[] | null }} RCMessage
 * */
/**
 * @typedef { 'playlist' | 'block' | 'clip' | 'overlay' | 'action' | 'recording' } EventTarget
 */

module.exports = {
  PlaydeckRCMessage,
};
