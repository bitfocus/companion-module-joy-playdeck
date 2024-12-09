const { playlistState } = require('./PlaydeckConstants');
const { InstanceStatus, TCPHelper, LogLevel } = require('@companion-module/base');
const { combineRgb } = require('@companion-module/base');

class PlaydeckPresets {
  constructor(instance) {
    this.instance = instance;
    this.fontSize = 14;
    this.presetDefinitions = {};

    this.init();
  }
  init() {
    this.updatePresets();
    this.instance.setPresetDefinitions(this.presetDefinitions);
  }

  updatePresets() {
    for (let i = 1; i <= 2; i++) {
      for (const command in CHOICES_COMMANDS) {
        const isRec = CHOICES_COMMANDS[command].id.includes('rec');
        let PlayOrRec = isRec ? `record` : i == 1 ? `left` : `right`;
        if (!(isRec && i == 2)) {
          this.makePreset({
            id: `preset_${PlayOrRec}_${CHOICES_COMMANDS[command].id}`,
            category: `${this.capitalizeFirstLetter(PlayOrRec)}${!isRec ? ` Playlist` : ``}`,
            text: CHOICES_COMMANDS[command].label,
            action: {
              actionId: CHOICES_COMMANDS[command].id,
              options: {
                playlist: i,
                id: 1,
                clip_id: 1,
              },
            },
            feedback: this.isStateCommand(CHOICES_COMMANDS[command].id)
              ? {
                  state: CHOICES_COMMANDS[command].id,
                  playlist: i,
                  block: 0,
                  clip: 0,
                }
              : undefined,
          });
        }
      }
    }
  }
  capitalizeFirstLetter(word) {
    const firstLetter = word.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();
    const remainingLetters = word.slice(1);
    return firstLetterCap + remainingLetters;
  }
  isStateCommand(command) {
    for (const prop in playlistState) {
      if (command === prop) {
        return true;
      }
    }
    return false;
  }
  makePreset(preset) {
    const newPreset = {
      [`${preset.id}`]: {
        category: preset.category,
        type: 'button',
        style: {
          text: preset.text,
          size: this.fontSize,
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
    Object.assign(this.presetDefinitions, newPreset);
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
  PlaydeckPresets,
};

CHOICES_COMMANDS = [
  { id: 'play', label: 'Play' },
  { id: 'pause', label: 'Pause' },
  { id: 'stop', label: 'Stop' },
  { id: 'nextclip', label: 'Next Clip' },
  { id: 'previousclip', label: 'Previous Clip' },
  { id: 'restartclip', label: 'Restart Clip' },
  { id: 'jump', label: 'Jump' },
  { id: 'fadein', label: 'Fade In' },
  { id: 'fadeout', label: 'Fade Out' },
  { id: 'muteaudio', label: 'Mute Audio' },
  { id: 'unmuteaudio', label: 'Unmute Audio' },
  { id: 'activateall', label: 'Activate All' },
  { id: 'stopalloverlays', label: 'Stop All Overlays' },
  { id: 'playoverlay', label: 'Play Overlay' },
  { id: 'stopoverlay', label: 'Stop Overlay' },
  { id: 'playaction', label: 'Play Action' },
  { id: 'selectblock', label: 'Select Block' },
  { id: 'activateblock', label: 'Activate Block' },
  { id: 'deactivateblock', label: 'Deactivate Block' },
  { id: 'selectclip', label: 'Select Clip' },
  { id: 'activateclip', label: 'Activate Clip' },
  { id: 'deactivateclip', label: 'Deactivate Clip' },
  { id: 'cue', label: 'Cue' },
  { id: 'cueandplay', label: 'Cue And Play' },
  { id: 'startrec', label: 'Start Recording' },
  { id: 'stoprec', label: 'Stop Recording' },
];
