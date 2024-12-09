CHOICES_PLAYLIST = [
  { id: '1', label: 'Left Playlist' },
  { id: '2', label: 'Right Playlist' },
];

CHOICES_STATE = [
  { id: 'play', label: 'PLAY' },
  { id: 'pause', label: 'PAUSE' },
  { id: 'stop', label: 'STOP' },
  { id: 'cue', label: 'CUE' },
];

COMMAND_REGEX = /<([^>]+)>/;
PORT_REGEX = /^d+$/;

dropdownPlaylists = {
  type: 'dropdown',
  id: 'playlist',
  label: 'Playlist',
  default: '1',
  choices: CHOICES_PLAYLIST,
};
/**
 * @enum { string }
 */
const PlaybackState = {
  stop: 'stop',
  pause: 'pause',
  play: 'play',
  cue: 'cue',
};

/**
 * @enum
 */
const ClipType = {
  Clock: 'Clock',
  Video: 'Video',
  Image: 'Image',
  Audio: 'Audio',
  Input: 'Input',
  Tube: 'Youtube',
  Action: 'Action',
  Highlight: 'Highlight',
};

module.exports = { CHOICES_PLAYLIST, CHOICES_STATE, COMMAND_REGEX, PORT_REGEX, dropdownPlaylists, PlaybackState, ClipType };
