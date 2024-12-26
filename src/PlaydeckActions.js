const { PlaydeckCommand } = require('./PlaydeckCommands');
const { LogLevel, CompanionActionDefinitions } = require('@companion-module/base');
const PlaydeckInstance = require('../index');
const { PlaydeckCommands } = require('./PlaydeckCommands');
const { PlaydeckConnection } = require('./PlaydeckConnections/PlaydeckConnection');

class PlaydeckActions {
  /** @type { PlaydeckInstance } */
  #instance;
  /** @type { CompanionActionDefinitions} */
  #actionDefinitions;
  /** @param { PlaydeckInstance } instance */
  constructor(instance) {
    this.#instance = instance;
    this.#actionDefinitions = this.#getActionDefinitions();
    this.#init();
  }
  /** @returns { CompanionActionDefinitions } */
  #getActionDefinitions() {
    let result = {};
    // TODO: initialise command via version!
    const commands = new PlaydeckCommands(this.#instance.version);
    commands.forEach((/** @type {PlaydeckCommand} */ command) => {
      /** @type { CompanionActionDefinitions } */
      result[command.command] = {
        name: command.commandName,
        callback: async (action) => {
          await this.#doAction(action);
        },
        options: PlaydeckCommands.getOptions(command),
        description: command.description,
      };
    });
    return result;
  }
  /**
   * @param { PlaydeckActionInfo } action
   */
  async #doAction(action) {
    /** @type { PlaydeckConnection } */
    const outgoingConnection = this.#instance.connectionManager.outgoing;
    const arg1 = await this.#instance.parseVariablesInString(action.options.arg1);
    const arg2 = await this.#instance.parseVariablesInString(action.options.arg2);
    const arg3 = await this.#instance.parseVariablesInString(action.options.arg3);
    const rcCommand = PlaydeckCommands.getRCCommand(action.actionId, [arg1, arg2, arg3]);
    if (outgoingConnection) {
      if (action.actionId) this.#instance.connectionManager.outgoing.send(rcCommand);
    }
  }
  #init() {
    this.#log('debug', 'Initializing...');
    this.#instance.setActionDefinitions(this.#actionDefinitions);
  }

  /**
   * @param {LogLevel} level
   * @param  {string} message
   * @returns
   */
  #log(level, message) {
    this.#instance.log(level, `Playdeck Actions: ${message}`);
  }
}

/**
 * @typedef { Object }  PlaydeckActionInfo
 * @property { string } id
 * @property  { string } controlId
 * @property  { string } actionId
 * @property { PlaydeckActionInfoOptions }  options
 */
/**
 * @typedef { Object }  PlaydeckActionInfoOptions
 * @property { number= } arg1
 * @property  { number= } arg2
 * @property  { number= } arg3
 */

module.exports = {
  PlaydeckActions,
};
