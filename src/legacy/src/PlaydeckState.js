const EventEmitter = require('events');
const PlaydeckInstance = require('./legacy/index');
const { CompanionVariableDefinition } = require('@companion-module/base');

class PlaydeckState extends EventEmitter {
  #globalState = null;
  #channelState = null;
  /** @param { PlaydeckInstance } instance */
  constructor(instance) {
    /**
     * @private
     * @
     */
    super();
    this.instance = instance;
    this.isBasic = true;
    this.#globalState = new ProjectState();
    this.#channelState = Array.from({ length: 8 }, (_, index) => new ChannelState(index + 1));
  }
  getVariableDefinitions() {}
  /**
   * @param { PlaydeckValues } newValues
   */
  updateValues(newValues) {
    if (newValues === null) {
      // console.log('!!! NULLL !!!');
      return;
    }
    let paramsToUpdate = [];
    if (this.#globalState !== null) {
      this.pushIfNew(paramsToUpdate, this.#globalState, newValues.global);
    }
    // TODO: make an forEach array of channels and skip if channel state is 0
    this.#channelState.forEach((channelState, channelIndex) => {
      this.pushIfNew(paramsToUpdate, channelState, newValues.channel[channelIndex]);
    });
    // this.pushIfNew(paramsToUpdate, this.playlistState.right, newValues.playlist.right);
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
class ProjectState {
  constructor() {
    /**
     * @type { PlaydeckStateParameter}
     */
    this.projectFileName = {
      value: null,
      variableDefinition: {
        variableId: `project_filename`,
        name: `Current project filename`,
      },
    };

    /**
     * @type { PlaydeckStateParameter}
     */
    this.projectName = {
      value: null,
      variableDefinition: {
        variableId: `project_name`,
        name: `Current project name`,
      },
    };
    this.clockTime = {
      value: null,
      variableDefinition: {
        variableId: `project_clock_time`,
        name: `Clock time`,
      },
    };
    this.timestamp = {
      value: null,
      variableDefinition: {
        variableId: `project_timestamp`,
        name: `Timestamp of current time`,
      },
    };
  }
}

/**
 * @typedef { Object } PlaydeckValues - Object with [prop]: value objects
 * @property { Object } project
 * @property { ChannelState[] } channel
 */

/**
 * @class
 */
class ChannelState {
  /** @param { number } channelNumber  */
  constructor(channelNumber) {
    this.playState = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_play_state`,
        name: `Play state of channel #${channelNumber}`,
      },
    };
    this.channelState = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_state`,
        name: `State of channel #${channelNumber}`,
      },
    };
    this.channelName = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_name`,
        name: `Name of channel #${channelNumber}`,
      },
    };
    this.blockID = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_block_id`,
        name: `Current block of channel #${channelNumber}`,
      },
    };
    this.blockName = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_block_name`,
        name: `Current block name of channel #${channelNumber}`,
      },
    };
    this.blockTimeEnd = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_block_time_end`,
        name: `Time when block of channel #${channelNumber} ends`,
      },
    };
    this.clipID = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_clip_id`,
        name: `Current clip in channel #${channelNumber}`,
      },
    };
    this.clipName = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_clip_name`,
        name: `Current clip name in channel #${channelNumber}`,
      },
    };
    this.clipProgress = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_clip_progress`,
        name: `Current clip progress in percents in channel #${channelNumber}`,
      },
    };
    this.clipDuration = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_clip_duration`,
        name: `Current clip duration in seconds in channel #${channelNumber}`,
      },
    };
    this.clipRemaining = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_clip_remaining`,
        name: `Current clip remaining time in seconds in channel #${channelNumber}`,
      },
    };
    this.clipPosition = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_clip_position`,
        name: `Current clip elapsed time in seconds in channel #${channelNumber}`,
      },
    };
    this.clipTimeEnd = {
      value: null,
      variableDefinition: {
        variableId: `channel_${channelNumber}_clip_time_end`,
        name: `Time when current clip in channel #${channelNumber} ends`,
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
