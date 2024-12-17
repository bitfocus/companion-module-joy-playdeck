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
/** @enum {typeof ConnectionType[keyof typeof ConnectionType]} */
const ConnectionType = /** @type {const} */ ({
  TCP: 'TCP',
  WS: 'WebSocket',
});

/** @enum {typeof ConnectionDirection[keyof typeof ConnectionDirection]} */
const ConnectionDirection = /** @type {const} */ ({
  Incoming: 'incoming',
  Outgoing: 'outgoing',
  BiDirectional: 'bidirectional',
});

/** @type { ConnectionType } */
let cp = (module.exports = { CHOICES_PLAYLIST, CHOICES_STATE, COMMAND_REGEX, PORT_REGEX, dropdownPlaylists, PlaybackState, ClipType, ConnectionType, ConnectionDirection });
