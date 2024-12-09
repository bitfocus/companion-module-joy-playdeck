const EventEmitter = require('events');
const PlaydeckInstance = require('../index');
const { PlaybackState, ClipType } = require('./PlaydeckConstants');
const { PlaydeckStateParameter } = require('./PlaydeckTypes');
const { CompanionVariableDefinition, Regex } = require('@companion-module/base');
const { forEach } = require('./upgrades');
/**
 * @class
 */
class PlaydeckState extends EventEmitter {
  /**
   * @param { PlaydeckInstance } instance
   */
  constructor(instance) {
    /**
     * @private
     * @
     */
    super();
    this.instance = instance;
    this.isBasic = true;
    this.generalState = null;
    this.playlistState = {
      left: new PlaylistState(1),
      right: new PlaylistState(2),
    };
  }
  getVariableDefinitions() {}
  /**
   *
   * @param { PlaydeckValues } newValues
   */
  updateValues(newValues) {
    let paramsToUpdate = [];
    if (this.generalState !== null && newValues.general != undefined) {
      this.pushIfNew(paramsToUpdate, this.generalState, newValues.general);
    }
    this.pushIfNew(paramsToUpdate, this.playlistState.left, newValues.playlist.left);
    this.pushIfNew(paramsToUpdate, this.playlistState.right, newValues.playlist.right);
    this.updateState(paramsToUpdate);
  }
  /**
   *
   * @param { Array } array
   * @param { Object.<string, PlaydeckStateParameter>} currentStateObj - object with
   * @param { Object.<string, any> } newValues
   */
  pushIfNew(array, currentStateObj, newValues) {
    Object.keys(currentStateObj).forEach((key) => {
      if (newValues[key] == undefined) return;
      if (currentStateObj[key].value != newValues[key]) {
        currentStateObj[key].value = newValues[key];
        array.push(currentStateObj[key]);
      }
    });
  }
  /**
   * @param { PlaydeckStateParameter[] } paramsToUpdate
   */
  updateState(paramsToUpdate) {
    if (paramsToUpdate.length === 0) return;
    let currentVariableDefinitions = this.instance.variableDefinitions;
    /**
     * @type { CompanionVariableDefinition[] }
     */
    let newVariableDefinitions = [];
    let changes = [];
    // TODO: check if new variableDefinition already exists
    newVariableDefinitions = paramsToUpdate.map((item) => item.variableDefinition).filter((varDef) => !this.isVariableDefinitionExists(varDef));
    changes = paramsToUpdate.reduce((acc, item) => {
      acc[item.variableDefinition.variableId] = item.value;
      return acc;
    }, {});

    this.instance.variableDefinitions = currentVariableDefinitions.concat(newVariableDefinitions);
    // this.instance.log('warn',  newVariableDefinitions.length );
    // this.instance.log('info', JSON.stringify(changes));
    if (newVariableDefinitions.length != 0) {
      this.instance.log('warn', JSON.stringify(this.instance.variableDefinitions));
      this.instance.setVariableDefinitions(this.instance.variableDefinitions);
    }

    this.instance.setVariableValues(changes);
  }
  /**
   *
   * @param {CompanionVariableDefinition} variableDefinition
   * @returns { boolean }
   */
  isVariableDefinitionExists(variableDefinition) {
    let result = false;
    this.instance.variableDefinitions.some((instanceVarDef) => {
      // this.instance.log('info', `${variableDefinition.variableId} == ${instanceVarDef.variableId}`);
      if (variableDefinition.variableId == instanceVarDef.variableId) {
        result = true;

        return true;
      }
    });
    return result;
  }
}

/**
 * @class
 */
class GeneralState {
  constructor() {
    /**
     * @type { PlaydeckStateParameter}
     */
    this.playlistFile = {
      value: null,
      variableDefinition: {
        variableId: `general_playlistFile`,
        name: `Current playlist file`,
      },
    };

    /**
     * @type { PlaydeckStateParameter}
     */
    this.activeChannels = {
      value: null,
      variableDefinition: {
        variableId: `general_activeChannels`,
        name: `Number of active channels`,
      },
    };
    /**
     * @type { PlaydeckStateParameter}
     */
    this.productionMode = {
      value: null,
      variableDefinition: {
        variableId: `general_productionMode`,
        name: `Number of active channels`,
      },
    };
  }
}

/**
 * @typedef { Object } PlaydeckValues - Object with [prop]: value objects
 * @property { Object } general
 * @property { { left: Object, right: Object }}  playlist
 */

/**
 * @class
 */
class PlaylistState {
  /**
   *
   * @param { number } playlistNumber
   */
  constructor(playlistNumber) {
    const sides = {
      1: 'left',
      2: 'right',
    };
    this.side = sides[playlistNumber];
    /**
     * @type { PlaydeckStateParameter}
     */
    this.state = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_state`,
        name: `State of ${this.side} playlist`,
      },
    };
    /**
     * @type { PlaydeckStateParameter}
     */
    this.blockID = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_block_id`,
        name: `Current block of ${this.side} playlist`,
      },
    };
    /**
     * @type { PlaydeckStateParameter}
     */
    this.clipID = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_id`,
        name: `Current clip in ${this.side} playlist`,
      },
    };
    /**
     * @type { PlaydeckStateParameter}
     */
    this.clipType = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_type`,
        name: `Current clip type in ${this.side} playlist`,
      },
    };
    /**
     * @type { PlaydeckStateParameter}
     */
    this.clipName = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_name`,
        name: `Current clip name in ${this.side} playlist`,
      },
    };
    /**
     * @type { PlaydeckStateParameter}
     */
    this.clipProgress = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_progress`,
        name: `Current clip progress in percents in ${this.side} playlist`,
      },
    };
    /**
     * @type { PlaydeckStateParameter}
     */
    this.clipPosition = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_position`,
        name: `Current clip elapsed time in seconds in ${this.side} playlist`,
      },
    };
  }
}

module.exports = {
  PlaydeckState,
};
