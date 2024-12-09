const { CHOICES_PLAYLIST, CHOICES_STATE, COMMAND_REGEX, dropdownPlaylists, playlistState } = require('./PlaydeckConstants');
const { InstanceStatus, LogLevel, CompanionActionDefinition } = require('@companion-module/base');
class PlaydeckActions {
  constructor(instance) {
    this.instance = instance;
    /**
     * @type { CompanionActionDefinition}
     */
    this.actionDefinitions = {
      play: {
        name: 'Play',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      pause: {
        name: 'Pause',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      stop: {
        name: 'Stop',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      nextclip: {
        name: 'Next Clip',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      previousclip: {
        name: 'Previous Clip',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      restartclip: {
        name: 'Restart Clip',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      jump: {
        name: 'Jump',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      fadein: {
        name: 'Fade In',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      fadeout: {
        name: 'Fade Out',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      muteaudio: {
        name: 'Mute Audio',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      unmuteaudio: {
        name: 'Unmute Audio',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      activateall: {
        name: 'Activate All',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      stopalloverlays: {
        name: 'Stop All Overlays',
        options: [dropdownPlaylists],
        callback: (action) => {
          this.doAction(action);
        },
      },
      playoverlay: {
        name: 'Play Overlay',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Overlay ID:',
            min: 1,
            max: 30,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      stopoverlay: {
        name: 'Stop Overlay',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Overlay ID:',
            min: 1,
            max: 30,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      playaction: {
        name: 'Play Action',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Action ID:',
            min: 1,
            max: 30,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      selectblock: {
        name: 'Select Block',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Block ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      activateblock: {
        name: 'Activate Block',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Block ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      deactivateblock: {
        name: 'Deactivate Block',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Block ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      selectclip: {
        name: 'Select Clip',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Block ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
          {
            type: 'number',
            id: 'clip_id',
            label: 'Clip ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      activateclip: {
        name: 'Activate Clip',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Block ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
          {
            type: 'number',
            id: 'clip_id',
            label: 'Clip ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      deactivateclip: {
        name: 'Deactivate Clip',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Block ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
          {
            type: 'number',
            id: 'clip_id',
            label: 'Clip ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      cue: {
        name: 'Cue',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Block ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
          {
            type: 'number',
            id: 'clip_id',
            label: 'Clip ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      cueandplay: {
        name: 'Cue And Play',
        options: [
          dropdownPlaylists,
          {
            type: 'number',
            id: 'id',
            label: 'Block ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
          {
            type: 'number',
            id: 'clip_id',
            label: 'Clip ID:',
            min: 1,
            max: 256,
            default: 1,
            required: true,
            range: false,
            regex: this.instance.REGEX_NUMBER,
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
      startrec: {
        name: 'Start Recording',
        callback: (action) => {
          this.doAction(action);
        },
      },
      stoprec: {
        name: 'Start Recording',
        callback: (action) => {
          this.doAction(action);
        },
      },
      customcommand: {
        name: 'Custom Command',
        options: [
          {
            type: 'textinput',
            id: 'command',
            label: 'Custom command:',
            required: true,
            regex: COMMAND_REGEX,
            useVariables: true,
            tooltip: 'Write custom command like <{command}|{playlist_id}|?{block_id}|?{clip_id}>',
          },
        ],
        callback: (action) => {
          this.doAction(action);
        },
      },
    };

    this.init();
  }
  init() {
    this.instance.setActionDefinitions(this.actionDefinitions);
  }
  async doAction(action) {
    let command = await this.getCommand(action);
    this.log('info', JSON.stringify(command));
    this.sendCommand(command);
  }
  async getCommand(action) {
    switch (action.actionId) {
      case 'play':
        return '<play|' + action.options.playlist + '>';

      case 'pause':
        return '<pause|' + action.options.playlist + '>';

      case 'stop':
        return '<stop|' + action.options.playlist + '>';

      case 'nextclip':
        return '<nextclip|' + action.options.playlist + '>';

      case 'previousclip':
        return '<previousclip|' + action.options.playlist + '>';

      case 'restartclip':
        return '<restartclip|' + action.options.playlist + '>';

      case 'jump':
        return '<jump|' + action.options.playlist + '>';

      case 'fadein':
        return '<fadein|' + action.options.playlist + '>';

      case 'fadeout':
        return '<fadeout|' + action.options.playlist + '>';

      case 'muteaudio':
        return '<muteaudio|' + action.options.playlist + '>';

      case 'unmuteaudio':
        return '<unmuteaudio|' + action.options.playlist + '>';

      case 'activateall':
        return '<activateall|' + action.options.playlist + '>';

      case 'stopalloverlays':
        return '<stopalloverlays|' + action.options.playlist + '>';

      case 'playoverlay':
        return '<playoverlay|' + action.options.playlist + '|' + action.options.id + '>';

      case 'stopoverlay':
        return '<stopoverlay|' + action.options.playlist + '|' + action.options.id + '>';

      case 'playaction':
        return '<playaction|' + action.options.playlist + '|' + action.options.id + '>';

      case 'selectblock':
        return '<selectblock|' + action.options.playlist + '|' + action.options.id + '>';

      case 'activateblock':
        return '<activateblock|' + action.options.playlist + '|' + action.options.id + '>';

      case 'deactivateblock':
        return '<deactivateblock|' + action.options.playlist + '|' + action.options.id + '>';

      case 'selectclip':
        return '<selectclip|' + action.options.playlist + '|' + action.options.id + '|' + action.options.clip_id + '>';

      case 'activateclip':
        return '<activateclip|' + action.options.playlist + '|' + action.options.id + '|' + action.options.clip_id + '>';

      case 'deactivateclip':
        return '<deactivateclip|' + action.options.playlist + '|' + action.options.id + '|' + action.options.clip_id + '>';

      case 'cue':
        return '<cue|' + action.options.playlist + '|' + action.options.id + '|' + action.options.clip_id + '>';

      case 'cueandplay':
        return '<cueandplay|' + action.options.playlist + '|' + action.options.id + '|' + action.options.clip_id + '>';

      case 'startrec':
        return '<startrec>';

      case 'stoprec':
        return '<stoprec>';

      case 'customcommand':
        return this.instance.parseVariablesInString(action.options.command);
    }
  }
  sendCommand(cmd) {
    const connection = this.instance.connections.actions;

    if (cmd !== undefined) {
      this.log('debug', `Sending ${cmd} to ${this.instance.config.host}`);

      if (connection !== undefined) {
        connection.send(cmd);
      } else {
        this.log('debug', `Socket not connected...`);
      }
    }
  }
  /**
   *
   * @param {LogLevel} level
   * @param  {string} message
   * @returns
   */
  log(level, message) {
    this.instance.log(level, message);
  }

  updateStatus(status) {
    this.instance.updateStatus(status);
  }
}

module.exports = {
  PlaydeckActions,
};
