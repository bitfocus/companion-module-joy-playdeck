const PlaydeckInstance = require('../index');
const { LogLevel, CompanionFeedbackDefinition, CompanionFeedbackDefinitions, combineRgb, SomeCompanionFeedbackInputField } = require('@companion-module/base');
const { PlaybackState } = require('./PlaydeckState');
class PlaydeckFeedbacks {
  /** @type { PlaydeckInstance } */
  #instance;
  /** @type { CompanionFeedbackDefinitions } */
  #feedbackDefinitions;
  constructor(instance) {
    this.#instance = instance;
    this.#feedbackDefinitions = this.#getFeedbackDefinitons();
    this.#init();
  }
  #init() {
    if (this.#instance.connectionManager.incoming) {
      this.#log('debug', `Initializing...`);
      this.#instance.setFeedbackDefinitions(this.#feedbackDefinitions);
    } else {
      this.#log('debug', `No incoming connection. Ignoring feedbacks...`);
    }
  }
  /**
   *
   * @returns { CompanionFeedbackDefinitions }
   */
  #getFeedbackDefinitons() {
    /** @type { CompanionFeedbackDefinitions } */
    let result = {
      /** @type { CompanionFeedbackDefinition } */
      checkState: {
        type: 'boolean',
        name: `Check playback state`,
        description: `Returns the state CLIP in BLOCK (0 for any) in selected playlist`,
        defaultStyle: {
          bgcolor: combineRgb(255, 0, 0),
          color: combineRgb(255, 255, 255),
        },
        options: [OptionsFields.DropdownPlaylist, OptionsFields.DropdownState, OptionsFields.TextInput('Block'), OptionsFields.TextInput('Clip')],

        callback: async (/** @type { StateFeedbackInfo } */ feedback, context) => {
          const playlist = this.#instance.state.playlistState[feedback.options.playlist];
          const isState = playlist.state.value === feedback.options.state;
          if (!isState) return false;

          const fClip = await context.parseVariablesInString(feedback.options.clip);
          const fBlock = await context.parseVariablesInString(feedback.options.block);

          const isAny = Number(fClip) === 0 && Number(fBlock) === 0;
          if (isAny) return isState;

          const blockID = playlist.blockID.value;
          const blockName = playlist.blockName.value;
          const isBlock = [`${blockID}`, `${blockName}`].indexOf(fBlock) > -1;
          const clipID = playlist.clipID.value;
          const clipName = playlist.clipName.value;
          const isClip = [`${clipID}`, `${clipName}`].indexOf(fClip) > -1;
          if (Number(fBlock) === 0) return isClip && isState;

          if (Number(fClip) === 0) return isBlock && isState;

          return isClip && isBlock && isState;
        },
      },
    };
    return result;
  }
  /**
   * @param {LogLevel} level
   * @param  {string} message
   * @returns
   */
  #log(level, message) {
    this.#instance.log(level, `Playdeck Feedbacks: ${message}`);
  }
}

/**
 * @typedef { Object } StateFeedbackInfo
 * @property { 'boolean' | 'advanced' } type
 * @property { string } id
 * @property { string } controlId
 * @property { string } feedbackId
 * @property { FeedbackOptions } options
 * */

/**
 * @typedef { Object } FeedbackOptions
 * @property { ('left' | 'right') } playlist
 * @property { PlaybackState } state
 * @property { string } block
 * @property { string } clip
 * */

/** @typedef {keyof typeof OptionsFields} PlaydeckFeedbacksOptionFields*/

/** @enum {typeof OptionsFields[keyof typeof OptionsFields]} */
const OptionsFields = {
  /** @type {SomeCompanionFeedbackInputField } */
  DropdownPlaylist: {
    type: 'dropdown',
    id: 'playlist',
    label: 'Playlist',
    default: '1',
    choices: [
      { id: 'left', label: 'Left Playlist' },
      { id: 'right', label: 'Right Playlist' },
    ],
  },
  /** @type {SomeCompanionFeedbackInputField } */
  DropdownState: {
    type: 'dropdown',
    id: 'state',
    label: 'State',
    default: PlaybackState.Play,
    choices: [
      { id: PlaybackState.Play, label: 'PLAY' },
      { id: PlaybackState.Pause, label: 'PAUSE' },
      { id: PlaybackState.Stop, label: 'STOP' },
      { id: PlaybackState.Cue, label: 'CUE' },
    ],
  },
  /** @type {{( string ) => SomeCompanionFeedbackInputField } } */
  TextInput: (/** @type { string } */ source) => {
    return {
      type: 'textinput',
      label: `${source} ID/Name (0 for any)`,
      id: `${source.toLowerCase()}`,
      default: 0,
      useVariables: true,
    };
  },
};

/** @typedef { ('BLOCK' | 'CLIP') } FeedbackSource */
/** @type { PlaydeckFeedbacksOptionFields } */
let able;

module.exports = {
  PlaydeckFeedbacks,
};
