const { CompanionVariableDefinition } = require('@companion-module/base');
const { PlaybackState, ClipType } = require('./PlaydeckConstants');
/**
 * @class
 */
class PlaydeckConfig {
  constructor() {
    /**
     * @type { string | null }
     */
    this.host = null;
    /**
     * @type { string | null }
     */
    this.wsPort = null;
    /**
     * @type { string | null }
     */
    this.tcpPortCom = null;
    /**
     * @type { boolean }
     */
    this.isTCPCom = false;
    /**
     * @type { string | null }
     */
    this.tcpPortEv = null;
    /**
     * @type { boolean }
     */
    this.isTCPEv = false;
  }
}
/**
 * @typedef { ('PLAYLIST' | 'BLOCK' | 'CLIP' | 'PATTERN' | 'OVERLAY' | 'ACTION' | 'FILENAME' | 'RESET' | 'TARGET') } argName
 */

/**
 * @class
 */
class PlaydeckCommand {
  constructor() {
    /**
     * @type { number | null }
     */
    this.version = null;
    /**
     * @type { string }
     */
    this.commandName = ``;
    /**
     * @type { string }
     */
    this.command = ``;
    /**
     * @type { string }
     */
    this.description = ``;
    /**
     * @type { argName | undefined }
     */
    this.arg1 = undefined;
    /**
     * @type { argName | undefined }
     */
    this.arg2 = undefined;
    /**
     * @type { argName | undefined }
     */
    this.arg3 = undefined;
  }
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
