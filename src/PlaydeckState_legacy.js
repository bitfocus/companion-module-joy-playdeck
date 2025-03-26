const EventEmitter = require('events');
const PlaydeckInstance = require('../index');
const { CompanionVariableDefinition } = require('@companion-module/base');

class PlaydeckState extends EventEmitter {
  /** @param { PlaydeckInstance } instance */
  constructor(instance) {
    /**
     * @private
     * @
     */
    super();
    this.instance = instance;
    this.isBasic = true;
    this.generalState = new GeneralState();
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
    newVariableDefinitions = paramsToUpdate.map((item) => item.variableDefinition).filter((varDef) => !this.isVariableDefinitionExists(varDef));
    changes = paramsToUpdate.reduce((acc, item) => {
      acc[item.variableDefinition.variableId] = item.value;
      return acc;
    }, {});

    this.instance.variableDefinitions = currentVariableDefinitions.concat(newVariableDefinitions);

    if (newVariableDefinitions.length != 0) {
      this.instance.setVariableDefinitions(this.instance.variableDefinitions);
    }

    this.instance.setVariableValues(changes);
    this.instance.checkFeedbacks('checkState');
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
        variableId: `general_playlist_file`,
        name: `Current playlist file`,
      },
    };

    /**
     * @type { PlaydeckStateParameter}
     */
    this.activeChannels = {
      value: null,
      variableDefinition: {
        variableId: `general_active_channels`,
        name: `Number of active channels`,
      },
    };
    /**
     * @type { PlaydeckStateParameter}
     */
    this.productionMode = {
      value: null,
      variableDefinition: {
        variableId: `general_production_mode`,
        name: `Production Mode state`,
      },
    };
    this.isRecording = {
      value: null,
      variableDefinition: {
        variableId: `general_recording`,
        name: `Recording state`,
      },
    };
    this.recordingDuration = {
      value: null,
      variableDefinition: {
        variableId: `general_recording_duration`,
        name: `Recording duration in seconds`,
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
  /** @param { number } playlistNumber  */
  constructor(playlistNumber) {
    const sides = {
      1: 'left',
      2: 'right',
    };
    this.side = sides[playlistNumber];
    /** @param { number } playlistNumber  */
    this.state = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_state`,
        name: `State of ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.blockID = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_block_id`,
        name: `Current block of ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.blockName = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_block_name`,
        name: `Current block name of ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.blockTimeEnd = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_block_time_end`,
        name: `Time when block of ${this.side} playlist ends`,
      },
    };
    /** @param { number } playlistNumber  */
    this.clipID = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_id`,
        name: `Current clip in ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.clipType = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_type`,
        name: `Current clip type in ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.clipName = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_name`,
        name: `Current clip name in ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.clipProgress = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_progress`,
        name: `Current clip progress in percents in ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.clipDuration = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_duration`,
        name: `Current clip duration in seconds in ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.clipRemaining = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_remaining`,
        name: `Current clip remaining time in seconds in ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.clipPosition = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_position`,
        name: `Current clip elapsed time in seconds in ${this.side} playlist`,
      },
    };
    /** @param { number } playlistNumber  */
    this.clipTimeEnd = {
      value: null,
      variableDefinition: {
        variableId: `playlist_${playlistNumber}_clip_time_end`,
        name: `Time when current clip in ${this.side} playlist ends`,
      },
    };
  }
}

/** @enum {typeof PlaybackState[keyof typeof PlaybackState]} */
const PlaybackState = /** @type {const} */ ({
  Stop: 'stop',
  Pause: 'pause',
  Play: 'play',
  Cue: 'cue',
});

/** @enum {typeof ClipType[keyof typeof ClipType]} */
const ClipType = /** @type {const} */ ({
  Clock: 'Clock',
  Video: 'Video',
  Image: 'Image',
  Audio: 'Audio',
  Input: 'Input',
  Tube: 'Youtube',
  Action: 'Action',
  Highlight: 'Highlight',
});

class PlaydeckStateParameter {
  /** @type { PlaybackState| ClipType | string | number| boolean | null } */
  value;
  /** @type { CompanionVariableDefinition } */
  variableDefinition;
}

module.exports = {
  PlaydeckState,
  PlaybackState,
  ClipType,
  PlaydeckStateParameter,
};
