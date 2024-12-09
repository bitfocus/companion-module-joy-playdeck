const { combineRgb } = require('@companion-module/base');
const { CHOICES_PLAYLIST, CHOICES_STATE, COMMAND_REGEX, dropdownPlaylists, playlistState } = require('./PlaydeckConstants');
const { InstanceStatus, TCPHelper, LogLevel } = require('@companion-module/base');

class PlaydeckFeedbacks {
  constructor(instance) {
    this.instance = instance;
    this.playlists = {
      1: {
        state: null,
        block: null,
        clip: null,
      },
      2: {
        state: null,
        block: null,
        clip: null,
      },
    };
    this.recording = false;
    this.variableDefinitions = [
      { variableId: `playlist_1_state`, name: `State of Left playlist` },
      { variableId: `playlist_1_block`, name: `Current block of left playlist` },
      { variableId: `playlist_1_clip`, name: `Current clip of left playlist` },
      { variableId: `playlist_2_state`, name: `State of Right playlist` },
      { variableId: `playlist_2_block`, name: `Current block of Right playlist` },
      { variableId: `playlist_2_clip`, name: `Current clip of Right playlist` },
    ];
    this.feedbackDefinitions = {
      checkState: {
        type: 'boolean',
        name: 'Check playback state',
        defaultStyle: {
          // The default style change for a boolean feedback
          // The user will be able to customise these values as well as the fields that will be changed
          bgcolor: combineRgb(255, 0, 0),
          color: combineRgb(0, 0, 0),
        },
        options: [
          dropdownPlaylists,
          {
            type: 'dropdown',
            id: 'state',
            label: 'State',
            default: playlistState.play,
            choices: CHOICES_STATE,
          },
          {
            type: 'number',
            label: 'Block ID (0 for any)',
            id: 'block',
            default: 0,
          },
          {
            type: 'number',
            label: 'Clip ID (0 for any)',
            id: 'clip',
            default: 0,
          },
        ],
        callback: (feedback) => {
          if (feedback.options.clip == 0 && feedback.options.block == 0) {
            return this.playlists[feedback.options.playlist].state === feedback.options.state;
          }
        },
      },
    };
    this.init();
  }
  init() {
    if (this.instance.connections.events) {
      this.instance.connections.events.on('data', (data) => {
        this.eventHandler(data);
      });
      this.instance.setVariableDefinitions(this.variableDefinitions);
      this.instance.setFeedbackDefinitions(this.feedbackDefinitions);
    }
  }
  eventHandler(data) {
    // this.log('debug', `Hello From Feedbacks: ${data}`);

    const EventMatchRegex = data.toString().match(COMMAND_REGEX);
    let event = null;
    if (EventMatchRegex) {
      const eventArray = EventMatchRegex[1].split('|');
      event = {
        source: eventArray[0].split('-')[0],
        event: eventArray[0].split('-')[1],
        playlist: eventArray[1],
        block: eventArray[2],
        clip: eventArray[3],
      };
    }
    switch (event?.source) {
      case 'playlist':
        this.playlists[event.playlist].state = event.event;
        break;
      case 'clip':
        this.playlists[event.playlist].block = event.block;
        this.playlists[event.playlist].clip = event.clip;
        if (event.event == playlistState.cue) {
          this.playlists[event.playlist].state = event.event;
        }
        break;
      case 'block':
      case 'overlay':
        break;
      case 'action':
        break;
      case 'recording':
        switch (event.event) {
          case 'start':
            this.recording = true;
            break;
          case 'end':
            this.recording = false;
            break;
        }
        break;
    }
    this.updateVariables();
    this.instance.checkFeedbacks('checkState');
  }
  updateVariables() {
    let changes = {
      playlist_1_state: this.playlists[1].state,
      playlist_1_block: this.playlists[1].block,
      playlist_1_clip: this.playlists[1].clip,
      playlist_2_state: this.playlists[2].state,
      playlist_2_block: this.playlists[2].block,
      playlist_2_clip: this.playlists[2].clip,
    };
    this.instance.setVariableValues(changes);
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
  PlaydeckFeedbacks,
};
