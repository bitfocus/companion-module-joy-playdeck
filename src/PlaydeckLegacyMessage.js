class PlaydeckLegacyMessage {
  constructor() {}
  static REGEX = /<([^>]+)>/;
  /**
   * Check if string is seems like Playdeck legacy Command/Event
   * @param { string } message
   * @returns { boolean }
   */
  static isLegacy(message) {
    return message.match(this.REGEX);
  }
  static makeMessage(message, arg1, arg2, arg3) {
    return `<${message}>`;
  }
}

module.exports = {
  PlaydeckLegacyMessage,
};
