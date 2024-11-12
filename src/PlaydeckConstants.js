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

dropdownPlaylists = {
  type: 'dropdown',
  id: 'playlist',
  label: 'Playlist',
  default: '1',
  choices: CHOICES_PLAYLIST,
};

playlistState = {
  stop: 'stop',
  pause: 'pause',
  play: 'play',
  cue: 'cue',
};

module.exports = { CHOICES_PLAYLIST, CHOICES_STATE, COMMAND_REGEX, dropdownPlaylists, playlistState };
