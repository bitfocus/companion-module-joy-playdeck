const PlaydeckInstance = require('../index');
const { PlaydeckCommand, PlaydeckCommands } = require('./PlaydeckCommands');
const { PlaybackState } = require('./PlaydeckState');
const { LogLevel, CompanionPresetDefinitions } = require('@companion-module/base');
const { combineRgb } = require('@companion-module/base');

class PlaydeckPresets {
  /** @type { PlaydeckInstance } */
  #instance;
  /** @type { number } */
  #fontSize = 10;
  /** @type { CompanionPresetDefinitions } */
  #presetDefinitions = {};
  constructor(instance) {
    this.#instance = instance;
    this.#init();
  }
  #init() {
    this.#updatePresetDefinitions(new PlaydeckCommands(this.#instance.version));
    this.#instance.setPresetDefinitions(this.#presetDefinitions);
  }
  /**
   *
   * @param { PlaydeckCommands } commands
   */
  #updatePresetDefinitions(commands) {
    for (let playlistNum = 1; playlistNum <= 2; playlistNum++) {
      commands.forEach((command) => {
        this.#addPresetForCommand(command, playlistNum);
      });
    }
  }
  /**
   *
   * @param {PlaydeckCommand} command
   * @param { number } playlistNum
   */
  #addPresetForCommand(command, playlistNum) {
    const category = this.#getCategory(command);
    const playlistSide = playlistNum === 1 ? 'left' : 'right';
    const isPlayList = category === 'playlist';
    const presetCategory = isPlayList ? `${playlistSide}_${category}` : category;

    const commandOptions = PlaydeckCommands.getOptions(command);
    const arg1Default = commandOptions[0] ? (commandOptions[0].choices ? commandOptions[0].choices[0].id : ``) : ``;
    this.#makePreset({
      id: `preset_${presetCategory}_${command.command}`,
      category: `${this.#capitalizeFirstLetter(presetCategory.replace('_', ' '))}`,
      text: `${isPlayList ? `${this.#capitalizeFirstLetter(playlistSide)} ` : ``}${command.commandName.replace(' - ', ' ')}`,
      action: {
        actionId: command.command,
        options: {
          arg1: isPlayList ? playlistNum : arg1Default,
          arg2: isPlayList ? 1 : ``,
          arg3: 1,
        },
      },
      feedback: this.#isStateCommand(command.command)
        ? {
            state: command.command,
            playlist: playlistSide,
            block: 0,
            clip: 0,
          }
        : undefined,
    });
  }
  /**
   *
   * @param {PlaydeckCommand} command
   * @return { PresetCategory }
   */
  #getCategory(command) {
    const isRec = command.command.includes('rec');
    const isSync = command.command.includes('sync');
    const isPlayList = command.arg1 === 'PLAYLIST';
    if (isRec) return 'record';
    if (isSync) return 'sync';
    if (isPlayList) return 'playlist';
    return 'common';
  }
  /**
   *
   * @param { string } word
   * @returns { string }
   */
  #capitalizeFirstLetter(word) {
    const firstLetter = word.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();
    const remainingLetters = word.slice(1);
    return firstLetterCap + remainingLetters;
  }

  #isStateCommand(command) {
    for (const prop in PlaybackState) {
      if (command === PlaybackState[prop]) {
        return true;
      }
    }
    return false;
  }

  #makePreset(preset) {
    const newPreset = {
      [`${preset.id}`]: {
        category: preset.category,
        type: 'button',
        style: {
          text: preset.text,
          size: this.#fontSize,
          color: combineRgb(255, 255, 255),
          bgcolor: combineRgb(0, 0, 0),
        },
        steps: [
          {
            down: [
              {
                actionId: preset.action.actionId,
                options: preset.action.options,
              },
            ],
            up: [],
          },
        ],
        feedbacks: preset.feedback
          ? [
              {
                feedbackId: `checkState`,
                options: {
                  playlist: preset.feedback.playlist,
                  state: preset.feedback.state,
                  block: preset.feedback.block,
                  clip: preset.feedback.clip,
                },
                style: {
                  color: combineRgb(255, 255, 255),
                  bgcolor: combineRgb(255, 0, 0),
                },
              },
            ]
          : [],
      },
    };
    Object.assign(this.#presetDefinitions, newPreset);
  }
  /**
   * @param { LogLevel } level
   * @param  { string } message
   * @returns
   */
  #log(level, message) {
    this.#instance.log(level, `Presets: ${message}`);
  }
}

/** @typedef { ('common' | 'playlist' | 'record' | 'sync') } PresetCategory */

module.exports = {
  PlaydeckPresets,
};
