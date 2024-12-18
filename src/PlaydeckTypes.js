const { CompanionVariableDefinition } = require('@companion-module/base');
const { PlaybackState, ClipType } = require('./PlaydeckConstants');
/**
 * @class
 */
class PlaydeckConfig {
  /** @type { string | null }  */
  host;
  /** @type { string | null }  */
  wsPort;
  /**  @type { string | null } */
  tcpPortCommands;
  /** @type { boolean } */
  isTCPCommands;
  /** @type { string | null } */
  tcpPortEvents;
  /** @type { boolean }  */
  isTCPEvents;
}

/**
 * @typedef { ('PLAYLIST' | 'BLOCK' | 'CLIP' | 'PATTERN' | 'OVERLAY' | 'ACTION' | 'FILENAME' | 'RESET' | 'TARGET') } argName
 */

/**
 * @class
 */
class PlaydeckCommand {
  /** @type { number | null } */
  version = null;
  /** @type { string } */
  commandName = ``;
  /** @type { string } */
  command = ``;
  /** @type { string } */
  description = ``;
  /** @type { argName | undefined } */
  arg1 = undefined;
  /** @type { argName | undefined } */
  arg2 = undefined;
  /** @type { argName | undefined } */
  arg3 = undefined;
}

class PlaydeckStateParameter {
  /**
   * @param { PlaybackState| ClipType | string | number| boolean | null } value
   * @param { CompanionVariableDefinition } variableDefinition
   */
  constructor(value, variableDefinition) {
    this.value = value;
    this.variableDefinition = variableDefinition;
  }
}

module.exports = {
  PlaydeckConfig,
  PlaydeckCommand,
  PlaydeckStateParameter,
};
